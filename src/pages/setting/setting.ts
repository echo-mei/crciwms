import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, App } from 'ionic-angular';
import { UpdatePasswordPage } from '../update-password/update-password';
import { LoginPage } from '../login/login';
import { StorageProvider } from '../../providers/storage/storage';
import { UserProvider } from '../../providers/user/user';
import { GetUpdateCodePage } from '../get-update-code/get-update-code';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {




  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public app: App,
    public storage: StorageProvider,
    public user: UserProvider
  ) {

  }

  goUpdataPwd() {
    this.navCtrl.push(UpdatePasswordPage);
  }

  goFotgetPwd() {
    this.navCtrl.push(GetUpdateCodePage, {status: true,accountNo:this.storage.lastLoginAccountNo});
  }

  loginOut() {
    this.actionSheetCtrl.create({
      title: '确认退出系统？',
      buttons: [
        {
          text: '确定', handler: () => {

            this.user.loginOut().subscribe( () => {
              this.storage.resetStorage();
              this.app.getRootNav().setRoot(LoginPage);
            })
            // this.userProvider.logout().subscribe(() => {
            //   this.app.getRootNav().setRoot(LoginPage);
            //   setTimeout(() => {
            //     this.storage.resetStorage();
            //     this.ws.close();
            //   }, 500);
            // });
          }
        },
        { text: '取消', role: 'cancel',cssClass: 'color: #000',}
      ]
    }).present();
  }
}
