import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../service/base.service';
import { UserProfile } from '../models/user-profile';
import { HttpClient } from '@angular/common/http';
import { URLS } from '../urls';

@Injectable({
    providedIn: 'root',
})
export class TrainingResolver implements Resolve<any> {
    private service: BaseService<UserProfile>

    constructor(private http: HttpClient) {
        this.service = new BaseService<UserProfile>(http, URLS.TRAINING);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const trainingId =  route.paramMap.get('trainingId');
        return this.service.getById(trainingId);
    }
}

//O método resolve é executado automaticamente antes de a rota ser ativada.
// Ele retorna os dados necessários para o componente da rota (neste caso, um treino específico).
//Usa route.paramMap.get('trainingId') para obter o ID do treino a partir da URL.
//Usa o método getById do serviço BaseService para buscar o treino pelo ID.
