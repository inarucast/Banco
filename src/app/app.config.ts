import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {AuthInterceptorService} from "./core/https/auth-interceptor.service";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      BrowserAnimationsModule
    ]),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptorService])
    ),
    provideRouter(routes), provideClientHydration()
  ]
};
