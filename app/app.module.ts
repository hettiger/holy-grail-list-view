import "./rxjs.imports";

import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA, ErrorHandler } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ItemService } from "./item/item.service";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { AppErrorHandler } from "./error/app-error.handler";
import { DataLoadingErrorHandler } from "./error/data-loading-error.handler";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler },
        DataLoadingErrorHandler,
        ItemService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }