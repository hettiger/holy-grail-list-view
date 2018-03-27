import { Component, OnInit } from "@angular/core";
import { Item } from "../item/item";
import { ItemService } from "../item/item.service";
import { ListView } from "tns-core-modules/ui/list-view";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { isIOS, device } from "tns-core-modules/platform";
import { Observable } from "rxjs/Observable";

declare const UIApplication: any;

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    items$: BehaviorSubject<Item[]>;

    isBusy$: BehaviorSubject<Boolean>;

    isContextualIndicatorActive$ = new BehaviorSubject(false);

    paddingBottom = 0;

    private listView: ListView;

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        const osVersion: number = +device.osVersion.replace(/^(\d+(?:\.\d+)).*$/, '$1');
        this.items$ = this.itemService.getItems();
        this.isBusy$ = this.itemService.getIsBusy();

        if (isIOS && osVersion >= 11.0) {
            const window = UIApplication.sharedApplication.keyWindow;
            this.paddingBottom = window.safeAreaInsets.bottom;
        }
    }

    onListViewLoaded(args): void {
        this.listView = args.object;

        if (isIOS) {
            this.listView.ios.allowsSelection = false;

            /**
             * Enforce UITableViewDelegateImpl
             *
             * Make sure UITableViewDelegateImpl is being used because that's the
             * tns-core-modules/ui/list-view delegate that is capable of correctly
             * measuring row heights.
             *
             * @see https://github.com/NativeScript/NativeScript/blob/1931669f79d4177eb2d7c90fe7573a1f18751eb7/tns-core-modules/ui/list-view/list-view.ios.ts#L300
             */
            this.listView.rowHeight = -1;

            /**
             * Enforce precise row height's
             *
             * Set the estimatedRowHeight to 0 in order to make sure that rows that
             * are currently off the screen will be measured precisely instead of just
             * using the estimated row height until they get scrolled into view.
             * This is very important in order to maintain the correct scroll position
             * when loading more items.
             */
            this.listView.ios.estimatedRowHeight = 0;
        }
    }

    loadMoreItems(): void {
        this.isContextualIndicatorActive$.next(true);

        this.itemService
            .fetchItems()
            .delayWhen(
                () => Observable.interval(0),
                Observable.interval(1000)
            )
            .finally(() => {
                this.isContextualIndicatorActive$.next(false);
            })
            .subscribe(hasChanges => {
                if (hasChanges) {
                    this.listView.refresh();
                }
            });
    }

    reload(): void {
        this.itemService.fetchItems(true)
            .subscribe(() => {
                if (this.listView) {
                    this.listView.refresh();
                }
            });
    }

    clear(): Promise<void> {
        return this.itemService.clearItems().then(() => {
            this.listView.refresh();
        });
    }
    
    refresh(): void {
        this.clear().then(() => {
            this.reload();
        });
    }
}