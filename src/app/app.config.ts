import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAuth0(authConfig),
    provideHttpClient(
      withInterceptors([authHttpInterceptorFn])
    ),
  ]
};
