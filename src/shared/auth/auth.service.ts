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
    //Constrói a URL base para o endpoint de login, utilizando constantes definidas em URLS.
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
      tap((response: any) => {
        this.cookieService.set('token', response.token);
      })
    );
  }
  // login(): Faz uma requisição POST ao endpoint de login da API. salva o token retornado pela API nos cookies

  logout(): void {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }
  // logout(): Remove o token de autenticação dos cookies. Redireciona o usuário para a página de login

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  // Verifica se o usuário está autenticado. Retorna true se um token estiver presente nos cookies

  getToken(): string | null {
    return this.cookieService.get('token');
  }
  // Recupera o token de autenticação armazenado nos cookies.

  register(value: UserRegister): Observable<any> {
    return this.http.post(`${URLS.BASE}${URLS.CREATE_ACCOUNT}`, value);
  }
  //Faz uma requisição POST ao endpoint de registro da API. criar um novo usuário
}
