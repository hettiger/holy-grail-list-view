import { Injectable } from "@angular/core";
import { Item } from "./item";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataLoadingError } from "../error/data-loading.error";
import { AppError } from "../error/app.error";
import { DataLoadingErrorHandler } from "../error/data-loading-error.handler";
import { loremIpsum } from "./lorem-ipsum";

@Injectable()
export class ItemService {
    private items$: BehaviorSubject<Item[]>;

    private isBusy$ = new BehaviorSubject(false);

    private isCompletelyLoaded = false;

    constructor(
        private httpClient: HttpClient,
        private dataLoadingErrorHandler: DataLoadingErrorHandler
    ) { }

    getItems(): BehaviorSubject<Item[]> {
        if (!this.items$) {
            this.items$ = new BehaviorSubject([]);
            this.fetchItems().subscribe();
        }

        return this.items$;
    }

    getIsBusy(): BehaviorSubject<Boolean> {
        return this.isBusy$;
    }

    fetchItems(refresh = false): Observable<Boolean> {
        if (refresh) {
            this.isCompletelyLoaded = false;
        } else if (this.isCompletelyLoaded) {
            return Observable.of(false);
        }

        this.isBusy$.next(true);

        return Observable
            .combineLatest([
                this.items$.take(1),
                this.httpClient.get("https://www.reddit.com/r/nativescript.json")
            ])
            .mergeMap((values) => {
                const items = refresh ? [] : <Item[]>values[0];
                const threads = <any>values[1];

                if (items.length && items[items.length - 1].type === "loading-indicator") {
                    items.pop();
                }

                threads.data.children.forEach(child => {
                    let item: Item = child.data;

                    if (item.thumbnail.length
                        && item.thumbnail.match(/^https?:\/\//i)
                        && item.title.length) {
                        items.push(Object.assign({}, item, {
                            type: "item",
                            randomText: loremIpsum.substr(ItemService.rand(0, 100), ItemService.rand(100, 500))
                        }));
                    }
                });

                if (items.length >= 100) {
                    this.isCompletelyLoaded = true;
                    items.push({ type: "end" });
                } else {
                    items.push({ type: "loading-indicator" });
                }

                this.items$.next(items);

                return Observable.of(true);
            })
            .catch((error) => this.handleError(new DataLoadingError(error)))
            .finally(() => {
                this.isBusy$.next(false)
            });
    }

    clearItems(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.isCompletelyLoaded = false;
            this.items$.next([]);
            this.isBusy$.next(false);
            resolve();
        });
    }

    handleError(error) {
        if (error instanceof DataLoadingError) {
            return Observable.empty().finally(() => {
                this.dataLoadingErrorHandler.handleError(error);
            });
        }

        return Observable.throw(new AppError(error));
    }

    static rand(min: number, max: number): number {
        return Math.floor(Math.random() * max) + min;
    }
}