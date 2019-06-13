import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';
import { IndexPage } from '../index';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {

  constructor(
    public app: App,
    public storage: StorageProvider
  ) {
  }

  reConnect() {
    if(navigator.onLine) {
      if(!this.storage.token) {
        this.app.getRootNav().setRoot(LoginPage);
        console.log(1)
      }else {
        this.app.getRootNav().setRoot(IndexPage);
      }
    }
  }

}
