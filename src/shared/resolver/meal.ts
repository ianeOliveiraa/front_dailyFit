import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BaseService} from '../service/base.service';
import {UserProfile} from '../models/user-profile';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../urls';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MealResolver implements Resolve<any> {
  private service: BaseService<UserProfile>

  constructor(private http: HttpClient) {
    this.service = new BaseService<UserProfile>(http, URLS.MEAL);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const mealId =  route.paramMap.get('mealId');
    return this.service.getById(mealId);
  }

}
