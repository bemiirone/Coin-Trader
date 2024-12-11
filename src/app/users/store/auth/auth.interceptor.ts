import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectAuthToken } from './auth.selectors';
import { firstValueFrom } from 'rxjs';
import { first, switchMap, take } from 'rxjs/operators'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectAuthToken).pipe(
    take(1), // Take only the first emitted value (equivalent to `first()`)
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(authReq); // Forward the (modified or unmodified) request
    })
  );
};
