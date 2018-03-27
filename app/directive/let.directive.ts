import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
    sdkLet: T;
}

@Directive({
    selector: '[sdkLet]'
})
export class LetDirective<T> {
    private _context: LetContext<T> = { sdkLet: null };

    constructor(_viewContainer: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>) {
        _viewContainer.createEmbeddedView(_templateRef, this._context);
    }

    @Input()
    set sdkLet(value: T) {
        this._context.sdkLet = value;
    }
}