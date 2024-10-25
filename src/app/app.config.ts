import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { coinsFeature } from './coins/store/coins.reducer';
import { CoinsEffects } from './coins/store/coins.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';

const devtoolsOptions = {
  maxAge: 25, // Retains last 25 states
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideStore({
      coins: coinsFeature.reducer,
    }),
    // provideEffects([CoinsEffects]),
    provideHttpClient(),
    importProvidersFrom(StoreDevtoolsModule.instrument(devtoolsOptions)),
],
};