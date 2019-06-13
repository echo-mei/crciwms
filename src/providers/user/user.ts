import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';
import { BASE_URL } from '../../config';
import { Observable } from 'rxjs';
import { StorageProvider } from '../storage/storage';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { Base64 } from '@ionic-native/base64';

@Injectable()
export class UserProvider {

  constructor(
    public http: HttpProvider,
    public storage: StorageProvider
  ) {
  }

  // 获取登陆密钥
  getRSAPublicKey(params?): Observable<any> {
    return this.http.get(`${BASE_URL}/base/base/getRSAPublicKey`, params);
  }

  // 登录
  login(params): Observable<any> {
    return this.http.post(`${BASE_URL}/base/base/login`, params);
  }

  // 退出登录
  loginOut(): Observable<any> {
    return this.http.delete(`${BASE_URL}/base/base/logout`);
  }

  // 获取版本号
  getVersionNumber(): Observable<any> {
    return this.http.get(`${BASE_URL}/base/base/getAppVersionNumber`);
  }

  // 申诉提交
  submitAppeal(params): Observable<any> {
    return this.http.post(`${BASE_URL}/appeal/creatAppeal`, params);
  }


  // 校验手机号是否在系统里面
  checkPhoneNumber(params): Observable<any> {
    return this.http.get(`${BASE_URL}/base/users/checkAccountNoMobile`, params);
  }

  updatePassword(params): Observable<any> {
    return this.http.post(`${BASE_URL}/base/users/updateUsersPassword`, params);
  }

  // 获取手机号
  getMobilePhone(): Observable<any> {
    return this.http.get(`${BASE_URL}/personInfo/getMinePhoneNum`)
  }

  // 短信验证码登录
  sendSMSCode(params): Observable<any> {
    return this.http.post(`${BASE_URL}/base/sendSMSCode`, params);
  }







  // 获取验证码 2
  getSMSCode(params): Observable<any> {
    return this.http.get(`${BASE_URL}/base/base/sendMessageCode`, params);
  }

  // 检验验证码
  checkMsg(params): Observable<any> {
    return this.http.get(`${BASE_URL}/base/base/checkMessageCode`, params);
  }

  // 验证码登录
  msgLogin(params): Observable<any> {
    return this.http.post(`${BASE_URL}/base/base/loginBySMSCode`, params);
  }

  resetPwd(params): Observable<any> {
    return this.http.post(`${BASE_URL}/base/users/updateUsersPasswordBySMSCode`, params);
  }

  // getIdNo
  getIdNoByPhone(params): Observable<any> {
    return this.http.get(`${BASE_URL}/person/getIdNoByPhone`, params);
  }


  // 获取修改手机号短信验证码
  getNewMobliePhoneSMSCode(params): Observable<any> {
    return this.http.get(`${BASE_URL}/userSMS/getNewMobliePhoneSMSCode`, params)
  }
  // 账户安全-获取手机号短信验证码
  getMobliePhoneSMSCode(params): Observable<any> {
    return this.http.get(`${BASE_URL}/userSMS/getMobliePhoneSMSCode`, params);
  }

  // 验证短信验证码
  checkUserSMS(params): Observable<any> {
    return this.http.get(`${BASE_URL}/userSMS/checkUserSMS`, params);
  }

  // 账户安全-验证用户名和密码
  validatorAccount(params): Observable<any>{
    return this.http.post(`${BASE_URL}/userSMS/checkUserAccount`, params);
  }
  // 账户安全-验证手机号和短信验证码
  validatorPhont(params): Observable<any> {
    return this.http.post(`${BASE_URL}/userSMS/checkUserAccountBySMS`, params)
  }


  // 退出
  logout(params?): Observable<any> {
    return this.http.delete(`${BASE_URL}/base/logout`, params);
  }

  // 获取当前最新版本号
  versionupdates(params): Observable<any> {
    return this.http.get(`${BASE_URL}/versionupdates`, params);
  }

  //获取人员personOid
  getPersonOid(params):Observable<any> {
    return this.http.get(`${BASE_URL}/base/users/findByUserCode`, params);
  }

}
