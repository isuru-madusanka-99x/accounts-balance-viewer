import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  success: boolean;
  message: string;
  recordsProcessed?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  uploadBalanceFile(file: File): Observable<UploadResponse> {
    return this.authService.getAccessToken().pipe(
      switchMap(token => {
        const formData = new FormData();
        formData.append('file', file);

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<UploadResponse>(`${this.apiUrl}/balances/upload`, formData, { headers });
      })
    );
  }
}