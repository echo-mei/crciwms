import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Events, Platform, NavController, Content, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';
import { JSEncrypt } from 'jsencrypt';
import { Device } from '@ionic-native/device';
import { Keyboard } from '@ionic-native/keyboard';
import { IndexPage } from '../index';
import { UpdatePasswordPage } from '../update-password/update-password';
import { ForgetPasswordPage } from '../forget-password/forget-password';

@Component({
  selector: 'page-get-update-code',
  templateUrl: 'get-update-code.html',
})
export class GetUpdateCodePage {
  second: number;
  loginForm: FormGroup;
  showPassword: false;
  loginStatus: boolean = true;
  accountNo: string;
  statusText: string = '短信验证码登录';
  checkNoFlag: boolean = true;
  fromLoginStatus: boolean = false;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public storage: StorageProvider,
    public events: Events,
    public navCtrl: NavController,
    private device: Device,
    public keyboard: Keyboard,
    public loadingCtrl: LoadingController,
    public user: UserProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
    this.fromLoginStatus = this.navParams.get('status');
    this.accountNo = this.navParams.get('accountNo');
    this.loginForm = formBuilder.group({
      accountNo: [this.accountNo, Validators.compose([Validators.required])],
      msgCode: ['', Validators.compose([Validators.required])]
    });
    console.log(this.navParams, this.fromLoginStatus)
  }

  isPhone() {
    let flag = this.loginForm.controls['accountNo'].value
      && /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.loginForm.controls['accountNo'].value);
    return flag;
  }

  sendMsg() {
    this.userProvider.getSMSCode({ mobile: this.loginForm.value.accountNo }).subscribe(
      (res) => {
        this.checkNoFlag = true;
        this.second = 60;
        let interval = setInterval(() => {
          this.second = this.second - 1;
          if (this.second == 0) {
            clearInterval(interval);
          }
        }, 1000);
      }
    );
  }

  getSMSCode() {
    this.checkNoFlag = false;
    if (this.loginForm.value.accountNo) {
      if (!this.isPhone()) {
        let toast = this.toastCtrl.create({
          cssClass: 'mini',
          message: '手机号码格式不正确',
          position: 'middle',
          duration: 2000
        });
        toast.present();
        this.checkNoFlag = true;
        return;
      }
    } else {
      let toast = this.toastCtrl.create({
        cssClass: 'mini',
        message: '手机号不能为空',
        position: 'middle',
        duration: 2000
      });
      toast.present();
      this.checkNoFlag = true;
      return;
    }

    this.user.checkPhoneNumber({ accountNo: this.loginForm.value.accountNo }).subscribe(res => {
      if (res == 'true') {
        this.sendMsg();
      } else {
        this.checkNoFlag = true;
        let toast = this.toastCtrl.create({
          cssClass: 'mini',
          message: '该用户不存在, 请检查号码是否填写正确!',
          position: 'middle',
          duration: 2000
        });
        toast.present();
      }
    },
      err => {
        this.checkNoFlag = true;
      })


  }

  checkMsCode() {
    let params = {
      mobile: this.loginForm.value.accountNo,
      code: this.loginForm.value.msgCode
    };

    this.userProvider.checkMsg(params).subscribe(res => {
      if (res == 200) {
        this.navCtrl.push(ForgetPasswordPage, params);
      } else {
        let toast = this.toastCtrl.create({
          cssClass: 'mini',
          message: '验证码错误',
          position: 'middle',
          duration: 2000
        });
        toast.present();
      }
    })
  }

  forbidden() {
    return false;
  }

}

