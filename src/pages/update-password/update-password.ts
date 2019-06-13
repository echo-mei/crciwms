import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {

  loginForm: FormGroup;
  oldpwd: any;
  pwd: any;
  repwd: any;
  idNo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public storage: StorageProvider,
    public alertCtrl: AlertController,
    public toast: ToastController,
    public app: App
  ) {
    this.loginForm = formBuilder.group({
      oldpwd: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(16),Validators.required])],
      pwd: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(16), Validators.required])],
      repwd: ['', Validators.compose([Validators.minLength(6),Validators.maxLength(16), Validators.required])]
    });
    this.oldpwd = this.loginForm.controls['oldpwd'];
    this.pwd = this.loginForm.controls['pwd'];
    this.repwd = this.loginForm.controls['repwd'];
    this.getIdNo();
  }

  getIdNo() {
    this.userProvider.getIdNoByPhone({phone: this.storage.lastLoginAccountNo}).subscribe( res => {
      this.idNo = res;
    })
  }

  toastTips(message) {
    const toast = this.toast.create({
      cssClass: 'mini',
      message: message,
      position: 'middle',
      duration: 2000
    })
    toast.present();
  }

  consolesom() {
    if (this.pwd.value.indexOf(" ") >= 0) {
      let msg = '密码不能输入空格';
      this.toastTips(msg);
      return;
    }

    if(this.pwd.value.length < 6 || this.pwd.length > 16) {
      let msg = '密码要求最少6位，最多16位， 请检查';
      this.toastTips(msg);
      return;
    }

    if (this.oldpwd.value == this.pwd.value) {
      let msg = '新密码不能与原密码一致，请检查';
      this.toastTips(msg);
      return;
    }
    if(this.pwd.value == this.idNo.substr(-6, 6)) {
      let msg = '新密码不能为初始密码，请检查';
      this.toastTips(msg);
      return;
    }

    // else if (this.pwd.value.length < 8 || this.pwd.value.length > 16) {
    //   const toast = this.toast.create({
    //     cssClass: 'mini',
    //     message: '密码要求最小8位、最大16位，请检查',
    //     position: 'middle',
    //     duration: 2000
    //   });
    //   toast.present();
    //   return;
    // } else {
    //   let reg = /^(?!([a-zA-Z]+|[a-z\d]+|[a-z~`@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;\"\'<,>\.\?\/\!]+|[A-Z\d]+|[A-Z~`@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;\"\'<,>\.\?\/\!]+|[\d~`@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;\"\'<,>\.\?\/\!]+)$)[a-zA-Z\d~`@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;\"\'<,>\.\?\/\!]+$/
    //   if (this.pwd.value && this.pwd.value != this.repwd.value) {
    //     const toast = this.toast.create({
    //       cssClass: 'mini',
    //       message: '两次输入的新密码不一致，请检查',
    //       position: 'middle',
    //       duration: 2000
    //     });
    //     toast.present();
    //     return;
    //   }
    //   if (!(reg.test(this.pwd.value))) {
    //     const toast = this.toast.create({
    //       cssClass: 'mini',
    //       message: '密码必须包含大写字母、小写字母、数字、符号至少三种组合，请检查',
    //       position: 'middle',
    //       duration: 2000
    //     });
    //     toast.present();
    //     return;
    //   }
    // }
    let params = {
      accountNo: this.storage.me.accountNo,
      oldPassword: this.oldpwd.value,
      password1: this.pwd.value,
      password2: this.repwd.value,
    }
    this.userProvider.updatePassword(params).subscribe(
      (data) => {
        this.toastTips(data);
        this.storage.resetStorage();
        this.app.getRootNav().setRoot(LoginPage);
      }
    )
  }

}
