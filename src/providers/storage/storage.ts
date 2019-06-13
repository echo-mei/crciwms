import { Injectable } from '@angular/core';
import { tokenKey } from '@angular/core/src/view';

@Injectable()
export class StorageProvider {

  constructor() {
  }
  set(key, value) {
    return localStorage.setItem(key, value);
  }
  get(key) {
    return localStorage.getItem(key);
  }
  remove(...args) {
    args.forEach((arg) => {
      localStorage.removeItem(arg);
    });
  }
  clear() {
    localStorage.clear();
  }
  // token1
  get token() {
    return this.get('token');
  }
  set token(value) {
    if (value == null) {
      this.remove('token');
    } else {
      this.set('token', value);
    }
  }
  // me
  get me() {
    return this.get('me') ? JSON.parse(this.get('me')) : null;
  }
  set me(value) {
    if (value == null) {
      this.remove('me');
    } else {
      this.set('me', JSON.stringify(value));
    }
  }
  // lastLoginAccountNo
  get lastLoginAccountNo() {
    return this.get('lastLoginAccountNo');
  }
  set lastLoginAccountNo(value) {
    if (value == null) {
      this.remove('lastLoginAccountNo');
    } else {
      this.set('lastLoginAccountNo', value);
    }
  }

  // lastLoginAccountNo
  get personOid() {
    return this.get('personOid');
  }
  set personOid(value) {
    if (value == null) {
      this.remove('personOid');
    } else {
      this.set('personOid', value);
    }
  }


  // 登出时重置
  resetStorage() {
    const lastLoginAccountNo = this.lastLoginAccountNo;
    this.clear();
    this.lastLoginAccountNo = lastLoginAccountNo;
  }

}
