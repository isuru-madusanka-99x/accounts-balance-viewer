import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Balance {
  accountName: string;
  accountCode: string;
  amount: number;
  formattedAmount: string;
}

export interface BalancePeriod {
  year: number;
  month: number;
  monthName: string;
  balances: Balance[];
}

export interface BalancePeriodsResponse {
  success: boolean;
  message: string;
  data: BalancePeriod[];
}

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getBalancePeriods(): Observable<BalancePeriod[]> {
    return this.authService.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        
        return this.http.get<BalancePeriodsResponse>(`${this.apiUrl}/balances/periods`, { headers });
      }),
      map((response: BalancePeriodsResponse) => response.data || [])
    );
  }

  getBalances(): Observable<Balance[]> {
    return this.authService.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        
        return this.http.get<Balance[]>(`${this.apiUrl}/balances`, { headers });
      })
    );
  }
}