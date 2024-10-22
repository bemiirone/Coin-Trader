import { Injectable } from '@angular/core';
import { CoinResponse } from './coins.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) { }
  public getCoins() {
    const params = {
      start: '1',
      limit: '5000',
      convert: 'USD'
    };
    return this.http.get<CoinResponse[]>(`${environment.cmcApi}`, {
      headers: {
      'X-CMC_PRO_API_KEY': `${environment.cmcApiKey}`
      },
      params: params
    });
  }
}
