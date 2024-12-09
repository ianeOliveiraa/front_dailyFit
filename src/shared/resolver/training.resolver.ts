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