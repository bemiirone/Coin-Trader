import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CoinResponse } from './coins.model';

@Injectable({
  providedIn: 'root'
})

export class CoinsService {
  constructor(private http: HttpClient) { }
  public getCoins() {
    const params = {
      start: '1',
      limit: '5000',
      convert: 'USD'
    };
    return this.http.get<CoinResponse>(`${environment.cmcApi}`, {
      headers: {
      'X-CMC_PRO_API_KEY': `${environment.cmcApiKey}`
      },
      params: params
    });
  }
}
