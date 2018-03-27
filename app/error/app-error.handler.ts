import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    handleError(error?: any): void {
        if (error) {
            console.error(error.toString());
        }
    }
}