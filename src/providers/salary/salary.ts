import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../config';
import { HttpProvider } from '../http/http';
import { StorageProvider } from '../storage/storage';
/*
  Generated class for the SalaryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SalaryProvider {

  constructor(
    public http: HttpProvider,
    public storage: StorageProvider
  ) {
    console.log('Hello SalaryProvider Provider');
  }

  // 我的工资
  getMySalary(params): Observable<any> {
    return this.http.get(`${BASE_URL}/wageBase/listWageBaseByPersonOid`, params);
  }


}
