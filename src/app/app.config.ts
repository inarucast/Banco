import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {AuthInterceptorService} from "./core/https/auth-interceptor.service";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      BrowserAnimationsModule
    ]),
    provideHttpClient(
      withInterceptors([AuthInterceptorService])
    ),
    provideRouter(routes)
  ]
};
