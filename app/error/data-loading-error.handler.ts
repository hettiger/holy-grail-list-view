import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class DataLoadingErrorHandler implements ErrorHandler {
    handleError(error?: any): void {
        const options = {
            title: "Error",
            message: "Failed to load data...",
            okButtonText: "OK"
        };

        alert(options);
    }
}