import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { MyInfoPage } from '../my-info/my-info';
import { MyContractPage } from '../my-contract/my-contract';
import { MySalaryPage } from '../my-salary/my-salary';
import { MyComplainPage } from '../my-complain/my-complain';
import { LoginPage } from '../login/login';
import { SettingPage } from '../setting/setting';
import { StorageProvider } from '../../providers/storage/storage';
import { UserProvider } from '../../providers/user/user';
import { ContractProvider } from '../../providers/contract/contract';
import { SalaryProvider } from '../../providers/salary/salary';
import { InfoProvider } from '../../providers/info/info';
import { VERSION } from '../../config';


@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {

  me = {};
  person:any;
  fileName: any;
  datas: Object = {};
  version:any;
  salaryInfo: any;
  salaryData: any;
  idNo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public stroage: StorageProvider,
    public user: UserProvider,
    public info:InfoProvider,
    public contract: ContractProvider,
    public money: SalaryProvider,
    public loadingCtrl:LoadingController
  ) {
    // this.getVersion();
    this.version = VERSION;
    this.me = this.stroage.me;
    this.initData();
  }

  initData(){
    this.getInfo();
    this.getContract();
    this.getSalary();
  }

  getVersion(){
    this.user.getVersionNumber().subscribe(res=>{
      this.version = res;
    })
  }

  getInfo() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.info.getInfo(this.stroage.personOid).subscribe(res => {
      loading.dismiss();
      this.person = res;
    },
    err => {
      loading.dismiss();
    });
  }

  getContract() {
    this.contract.getContarctInfo({personOid: this.stroage.personOid}).subscribe( data => {
      this.datas = data;
      this.idNo = data.idNo;
      if(data.contractPath) {
        var spt = data.contractPath.split('-');
        this.fileName = spt[spt.length-1];
      }
    })
  }

  getSalary() {
    var params = {
      personOid: this.stroage.personOid,
      wageStatus: 2
    }
    this.money.getMySalary(params).subscribe(data => {
      if(data) {
        let dateList = data[0].createdDate.split('-');
        dateList[1] = dateList[1]<10 ? dateList[1].split('')[1]:dateList[1];
        this.salaryInfo = `${dateList[0]}年${dateList[1]}月工资已发放!`;
        this.salaryData = data;
      }
    })
  }

  updateMyInfo(){
    this.getInfo();
  }

  updateMyContract(){
    this.getContract();
  }

  updateMySalary(){
    this.getSalary();
  }

  goMyInfo() {
    this.navCtrl.push(MyInfoPage,{
      person:this.person,
      onUpdate:this.updateMyInfo.bind(this)
    });
  }

  goMyContract() {
    this.navCtrl.push(MyContractPage,{onUpdate:this.updateMyContract.bind(this)});
  }

  goMySalary() {
    this.navCtrl.push(MySalaryPage, {
      data: this.salaryData,
      onUpdate:this.updateMySalary.bind(this)
    });
  }

  goMyComplain() {
    this.navCtrl.push(MyComplainPage);
  }

  goSetting() {
    // this.navCtrl.setRoot(LoginPage);
    this.navCtrl.push(SettingPage);
  }

}
