import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectAuthToken } from './auth.selectors'; // Selector for the token
import { first, switchMap } from 'rxjs/operators'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select(selectAuthToken).pipe(
      first(),
      switchMap((token) => {
        if (token) {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next.handle(authReq);
        }
        return next.handle(req);
      })
    );
  }
}
