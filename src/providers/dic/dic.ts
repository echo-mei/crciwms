import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpProvider } from '../http/http';
import { BASE_URL } from '../../config';

@Injectable()
export class DicProvider {

  constructor(public http: HttpProvider) {
  }

  getDicItemList(params?): Observable<any> {
    return this.http.get(`${BASE_URL}/dic/getDicItemList`, params);
  }

}
