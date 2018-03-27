// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import {enableProdMode} from '@angular/core';

import { AppModule } from "./app.module";

// Registration of additional elements.
import "./element-registry";

enableProdMode();
platformNativeScriptDynamic().bootstrapModule(AppModule);
