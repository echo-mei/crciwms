import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Events, Platform, NavController, Content, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';
import { JSEncrypt } from 'jsencrypt';
import { Device } from '@ionic-native/device';
import { Keyboard } from '@ionic-native/keyboard';
import { IndexPage } from '../index';
import { UpdatePasswordPage } from '../update-password/update-password';
import { GetUpdateCodePage } from '../get-update-code/get-update-code';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @ViewChild('content') content: Content;

  second: number;
  loginForm: FormGroup;
  showPassword: false;
  loginStatus: boolean = true;
  statusText: string = '短信验证码登录';
  checkNoFlag: boolean = true;
  interval: any;

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
    public toastCtrl: ToastController
  ) {
    this.loginForm = formBuilder.group({
      // accountNo: [this.storage.lastLoginAccountNo, Validators.compose([Validators.required,Validators.maxLength(20)])],
      // password: ['', Validators.compose([Validators.required,Validators.maxLength(20)])],
      // msgCode: ['', Validators.compose([Validators.required,Validators.maxLength(6)])]
      accountNo: [this.storage.lastLoginAccountNo, Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      msgCode: ['']
    });
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.content.scrollTo(0, document.getElementById('userCode').offsetTop, 20);
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.content.scrollTo(0, 0, 20);
    });
  }

  isPhone() {
    let flag = this.loginForm.controls['accountNo'].value
      && /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.loginForm.controls['accountNo'].value);
    // if (flag) {
    //   this.loginForm.controls['password'].clearValidators();
    //   this.loginForm.controls['password'].updateValueAndValidity();
    //   this.loginForm.controls['msgCode'].setValidators([Validators.required]);
    // } else {
    //   this.loginForm.controls['msgCode'].clearValidators();
    //   this.loginForm.controls['msgCode'].updateValueAndValidity();
    //   this.loginForm.controls['password'].setValidators([Validators.required]);
    // }
    return flag;
  }

  changeLoginStatus() {
    this.clearMsgInterval();
    this.loginStatus = !this.loginStatus;
    this.statusText = this.loginStatus ? '短信验证码登录' : '密码登录';
    this.loginForm.controls['password'].setValue('');
    this.loginForm.controls['msgCode'].setValue('');
    if (this.loginStatus) {
      this.loginForm.controls['msgCode'].clearValidators();
      this.loginForm.controls['msgCode'].updateValueAndValidity();
      this.loginForm.controls['password'].setValidators([Validators.required]);
      return;
    }
    this.loginForm.controls['password'].clearValidators();
    this.loginForm.controls['password'].updateValueAndValidity();
    this.loginForm.controls['msgCode'].setValidators([Validators.required]);
  }

  sendMsg() {
    this.userProvider.getSMSCode({ mobile: this.loginForm.value.accountNo }).subscribe(
      (res) => {
        this.checkNoFlag = true;
        this.second = 60;
        this.interval = setInterval(() => {
          this.second = this.second - 1;
          if (this.second == 0) {
            this.clearMsgInterval();
          }
        }, 1000);
      }
    );
  }

  clearMsgInterval() {
    this.second = 0;
    clearInterval(this.interval);
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

  // 生成唯一的uuid
  getUUID() {
    return 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  checkMsCode() {
    if (this.loginStatus) {
      let fn = 'login';
      this.login(fn);
    } else {
      let params = {
        mobile: this.loginForm.value.accountNo,
        code: this.loginForm.value.msgCode
      };
      console.log(params)
      this.userProvider.checkMsg(params).subscribe(res => {
        if (res == 200) {
          let fn = 'msgLogin'
          this.login(fn);
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
  }

  login(fn) {

    let loading = this.loadingCtrl.create();
    loading.present();
    let params = {
      accountNo: this.loginForm.value.accountNo,
      channel: /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent) ? 'MOBILE' : 'PC',
      deviceId: this.device.uuid ? this.device.uuid.replace(/-/g, "") : this.getUUID(),
    };

    this.userProvider.getRSAPublicKey().subscribe(
      (signKey) => {

        var encrypt = new JSEncrypt();// 实例化加密对象
        encrypt.setPublicKey(signKey);// 设置公钥
        if (this.loginStatus) {
          params['password'] = encrypt.encrypt(this.loginForm.value.password)
        } else {
          params['msgCode'] = this.loginForm.value.msgCode;
        }
        this.userProvider[fn](params).subscribe(
          (data) => {
            this.storage.token = data.authorization;
            this.storage.me = data;
            this.storage.lastLoginAccountNo = params.accountNo;
            this.user.getPersonOid({ userCode: this.storage.me.userCode }).subscribe(res => {
              this.storage.personOid = res.refId;
              loading.dismiss();
              this.user.getIdNoByPhone({ phone: this.loginForm.value.accountNo }).subscribe(res => {
                if (this.loginForm.value.password == res.substr(-6, 6)) {
                  this.navCtrl.setRoot(UpdatePasswordPage);
                } else {
                  this.navCtrl.setRoot(IndexPage);
                }
              })

            });

          },
          err => {
            loading.dismiss();
          }
        );
      },
      err => {
        loading.dismiss();
      }
    );
  }

  forgetPwd() {
    this.clearMsgInterval();
    this.navCtrl.push(GetUpdateCodePage,{accountNo:this.loginForm.value.accountNo});
  }

  forbidden() {
    return false;
  }

}
