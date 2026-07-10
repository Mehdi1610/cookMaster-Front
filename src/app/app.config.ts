import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { cookMasterPreset } from './cookMaster.preset';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
/*
export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(
            withInterceptors([authInterceptor, authErrorInterceptor]),
        ),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: cookMasterPreset,
                options: {
                  darkModeSelector: 'none'
                }
            },
        }),
        MessageService,
    ],
};
*/
export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([authInterceptor]),
        ),
        providePrimeNG({
            theme: {
                preset: cookMasterPreset,
                options: {
                  darkModeSelector: 'none'
                }
            },
        }),
        MessageService,
    ],
};

