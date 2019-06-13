import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {

  loginForm: FormGroup;
  pwd: any;
  repwd: any;
  accountNo: any;
  myIdNo: any;

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
    this.userProvider.getIdNoByPhone({phone: this.navParams.data.mobile}).subscribe( res => {
      this.myIdNo = res;
    })
    this.loginForm = formBuilder.group({
      pwd: ['', Validators.compose([Validators.maxLength(16), Validators.required])],
      repwd: ['', Validators.compose([Validators.maxLength(16), Validators.required])]
    });
    this.pwd = this.loginForm.controls['pwd'];
    this.repwd = this.loginForm.controls['repwd'];
    this.accountNo = this.navParams.data.mobile;
  }

  toastTips(msg) {
    const toast = this.toast.create({
      cssClass: 'mini',
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

  consolesom() {

    if(this.pwd.value == this.myIdNo.substr(-6, 6)) {
      let msg = '新密码不能为初始密码，请检查';
      this.toastTips(msg);
      return;
    }

    if (this.pwd.value.length < 6 || this.pwd.value.length > 16) {
      let msg = '密码要求最小6位，最大16位，请检查';
      this.toastTips(msg);
      return;
    } 
    if (this.pwd.value && this.pwd.value != this.repwd.value) {
      let msg = '两次输入的密码不一致，请检查';
      this.toastTips(msg);
      return;
    }
    // else {
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
      accountNo: this.accountNo,
      oldPassword: '',
      password1: this.pwd.value,
      password2: this.repwd.value,
    }
    console.log(params, 'mypa')
    this.userProvider.resetPwd(params).subscribe(
      (data) => {
        this.toastTips(data);
        this.storage.resetStorage();
        this.app.getRootNav().setRoot(LoginPage);
      }
    )
  }

}
