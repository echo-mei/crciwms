import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';


@Component({
  selector: 'page-my-complain',
  templateUrl: 'my-complain.html',
})
export class MyComplainPage {

  myAppeal: string = "";
  maxLength: number = 500;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public user: UserProvider,
    public stroage: StorageProvider,
    public myAlert: AlertController
  ) {
  }

  submitAppeal() {
    
    let params = {
      name: this.stroage.me.personName,
      content: this.myAppeal,
      personOid: this.stroage.personOid
    }
    
    this.user.submitAppeal(params).subscribe( data => {
      let alt = this.myAlert.create({
        message: data,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: '确定',
            handler: () => {
              this.myAppeal = '';
              this.navCtrl.pop();
            }
          },
        ],
      });
      alt.present();
    })
  }

}

