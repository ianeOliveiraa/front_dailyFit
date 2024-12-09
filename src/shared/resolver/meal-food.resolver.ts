import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../service/base.service';
import { UserProfile } from '../models/user-profile';
import { HttpClient } from '@angular/common/http';
import { URLS } from '../urls';

@Injectable({
  providedIn: 'root',
})
export class MealFoodResolver implements Resolve<any> {
  private service: BaseService<UserProfile>

  constructor(private http: HttpClient) {
    this.service = new BaseService<UserProfile>(http, URLS.MEAL_FOOD);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const action = route.paramMap.get('action');
    if (isNaN(parseInt(action))) {
      return null;
    }
    return this.service.getById(action);
  }
}
