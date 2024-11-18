import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { coinsFeature } from './coins/store/coins.reducer';
import { CoinsEffects } from './coins/store/coins.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { usersFeature } from './users/store/user.reducer';
import { UserEffects } from './users/store/user.effects';
import { TradesEffects } from './trades/store/trades.effects';
import { tradesFeature } from './trades/store/trades.reducer';
import { ModalModule } from 'ngx-bootstrap/modal';

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
      users: usersFeature.reducer,
      trades: tradesFeature.reducer,
    }),
    provideEffects([CoinsEffects, UserEffects, TradesEffects]),
    provideHttpClient(withFetch()),
    importProvidersFrom([StoreDevtoolsModule.instrument(devtoolsOptions), ModalModule.forRoot()]),
    provideCharts(withDefaultRegisterables()),
],
};