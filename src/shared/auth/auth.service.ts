import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { URLS } from '../urls';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';
import { UserRegister } from '../models/user-register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '';

  constructor(private http: HttpClient,
    private router: Router, private cookieService: CookieService) {
    this.apiUrl = `${URLS.BASE}${URLS.LOGIN}`;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
      tap((response: any) => {
        this.cookieService.set('token', response.token);
      })
    );
  }

  logout(): void {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.cookieService.get('token');
  }

  register(value: UserRegister): Observable<any> {
    return this.http.post(`${URLS.BASE}${URLS.CREATE_ACCOUNT}`, value);
  }
}
