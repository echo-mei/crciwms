import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../config';
import { HttpProvider } from '../http/http';
import { StorageProvider } from '../storage/storage';
/*
  Generated class for the ContractProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContractProvider {

  constructor(
    public http: HttpProvider,
    public storage: StorageProvider
  ) {
  }

  // 合同 PDF
  getContarctInfo(params): Observable<any> {
    // return this.http.get(`${BASE_URL}/upload/downloadFile`, params);
    return this.http.get(`${BASE_URL}/contract/getContractByPersonOid`, params);
  }

  // 合同 PDF
  getContarctPDF1(params): Observable<any> {
    return this.http.getBlob(`${BASE_URL}/contract/downLoadContract`, params);
  }
  getContarctPDF2(params): Observable<any> {
    return this.http.getBlob(`${BASE_URL}/contract/downLoadContractPDF`, params);
  }

}
