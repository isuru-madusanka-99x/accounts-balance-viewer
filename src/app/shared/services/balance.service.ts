import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Balance {
  name: string;
  number: string;
  balance: number;
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