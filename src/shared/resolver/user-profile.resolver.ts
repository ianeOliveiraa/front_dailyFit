import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { BaseService } from '../service/base.service';
import { UserProfile } from '../models/user-profile';
import { HttpClient } from '@angular/common/http';
import { URLS } from '../urls';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class UserProfileResolver implements Resolve<any> {
    private service: BaseService<UserProfile>

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
        this.service = new BaseService<UserProfile>(http, URLS.USERPROFILE);
    }

    resolve(): Observable<any> {
        if (!this.authService.isAuthenticated){
            this.router.navigate(['/login']);
            return EMPTY;
        }
        return this.service.getById("user").pipe(
            catchError((error) => {
              console.error('Erro ao carregar o perfil do usuário:', error);
              this.router.navigate(['/login']);
              return EMPTY;
            })
          );
    }
}

//O método resolve é chamado automaticamente antes de ativar a rota.
// Ele tenta carregar os dados do perfil do usuário a partir do backend.
