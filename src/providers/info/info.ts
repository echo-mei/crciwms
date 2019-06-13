import { HttpProvider } from '../http/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../config';
import { Observable } from 'rxjs';

/*
  Generated class for the InfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InfoProvider {

  constructor(public http: HttpProvider) {
    console.log('Hello InfoProvider Provider');
  }

  // 获取个人信息
  getInfo(personOid): Observable<any> {
    return this.http.get(`${BASE_URL}/person/${personOid}`);
  }

  // 获取字典信息
  getDicItemList(dicTypeCode): Observable<any> {
    return this.http.get(`${BASE_URL}/dic/getDicItemList`, {dicTypeCode: dicTypeCode});
  }

  // 获取证照图片信息
  getImage(params): Observable<any> {
    return this.http.getBlob(`${BASE_URL}/person/getImage`,params);
  }

  // 上传图片
  uploadImage(params,files?): Observable<any> {
    return this.http.upload(`${BASE_URL}/person/insertImage`,params,files);
  }

  // 删除图片
  deleteImage(params): Observable<any> {
    return this.http.delete(`${BASE_URL}/person/deleteImage/${params.personOid}/${params.imageType}`);
  }
}
