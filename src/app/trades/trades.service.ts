import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trade } from './trades.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradesService {
  private apiUrl = 'http://localhost:5001/api/trades'

  constructor(private http: HttpClient) {}

  getTrades(): Observable<any> {
    return this.http.get<Trade[]>(this.apiUrl);
  }

  addTrade(trade: Trade): Observable<Trade> {
    return this.http.post<Trade>(this.apiUrl, trade);
  }

  updateTrade(id: string, trade: Partial<Trade>): Observable<Trade> {
    return this.http.put<Trade>(`${this.apiUrl}/${id}`, trade);
  }

  deleteTrade(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
