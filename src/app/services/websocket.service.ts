import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, switchMap, take, timeout } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthToken } from '../users/store/auth/auth.selectors';

export interface PriceUpdate {
  coin_id: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export interface TradeNotification {
  _id: string;
  user_id: string;
  coin_id: number;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  volume: number;
  order: 'buy' | 'sell';
  date: string;
}

export interface PortfolioUpdate {
  userId: string;
  portfolio_total: number;
  cash: number;
  deposit: number;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null;
  private priceUpdateSubject = new Subject<PriceUpdate>();
  private tradeNotificationSubject = new Subject<TradeNotification>();
  private portfolioUpdateSubject = new Subject<PortfolioUpdate>();
  private connectionSubject = new Subject<boolean>();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private store: Store
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  connect(): Observable<boolean> {
    if (!this.isBrowser) {
      return throwError(() => new Error('WebSocket not available in SSR'));
    }

    if (this.socket?.connected) {
      this.connectionSubject.next(true);
      return this.connectionSubject.asObservable();
    }

    return this.store.select(selectAuthToken).pipe(
      take(1),
      switchMap((token) => {
        const authToken = token ?? '';

        this.socket = io('http://localhost:5001', {
          auth: { token: authToken },
          transports: ['websocket'],
          autoConnect: true,
        });

        this.setupListeners();

        return this.connectionSubject.asObservable().pipe(
          timeout(10000),
          catchError(() => {
            this.disconnect();
            return throwError(() => new Error('WebSocket connection timeout after 10s'));
          })
        );
      })
    );
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.connectionSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connectionSubject.next(false);
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('price_update', (data: PriceUpdate) => {
      this.priceUpdateSubject.next(data);
    });

    this.socket.on('trade_notification', (data: TradeNotification) => {
      this.tradeNotificationSubject.next(data);
    });

    this.socket.on('portfolio_update', (data: PortfolioUpdate) => {
      this.portfolioUpdateSubject.next(data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionSubject.next(false);
  }

  getPriceUpdates$(): Observable<PriceUpdate> {
    return this.priceUpdateSubject.asObservable();
  }

  getTradeUpdates$(): Observable<TradeNotification> {
    return this.tradeNotificationSubject.asObservable();
  }

  getPortfolioUpdates$(): Observable<PortfolioUpdate> {
    return this.portfolioUpdateSubject.asObservable();
  }

  getConnectionStatus$(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }
}
