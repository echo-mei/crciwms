import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';
import { SalaryProvider } from '../../providers/salary/salary';

@Component({
  selector: 'page-my-salary',
  templateUrl: 'my-salary.html',
})
export class MySalaryPage {

  datas: any;
  list = [];
  myIndex = 0;
  loading:any;
  // 更新首页数据
  onUpdate:()=>{};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public storage: StorageProvider,
    public money: SalaryProvider,
    public loadingCtrl: LoadingController
  ) {

    // this.initData();
    this.onUpdate = this.navParams.get("onUpdate");
    this.getSalary(this.storage.personOid);
  }

  ionViewDidLeave() {
    this.onUpdate();
  }


  showDetial(i) {
    this.datas[i].show = !this.datas[i].show;
  }

  initData () {
    this.datas = [
      {
        year: 2019,
        details: [
          {
            m: '5月份',
            details: [
              {
                s: '15,000',
                isFirst: true
              },
              {
                s: '15,000',
              },
              {
                s: '15,000',
              }
            ]

          },
          {
            m: '4月份',
            details: [
              {
                s: '15,000',
                isFirst: true
              },
              {
                s: '15,000',
              },
              {
                s: '15,000',
              }
            ]
          },
          {
            m: '3月份',
            details: [
              {
                s: '15,000',
                isFirst: true
              },
              {
                s: '15,000',
              },
            ]
          },
          // {
          //   m: '3月份',
          //   s: '15,000',
          //   isFirst: true
          // },
          // {
          //   m: '3月份',
          //   s: '15,000'
          // },
          // {
          //   m: '2月份',
          //   s: '15,000',
          //   isFirst: true
          // },
          // {
          //   m: '1月份',
          //   s: '15,000',
          //   isFirst: true
          // }
        ],
      },
      {
        year: 2018,
        details: [
          {
            m: '5月份',
            s: '15,000'
          },
          {
            m: '4月份',
            s: '15,000'
          },
          {
            m: '3月份',
            s: '15,000'
          },
          {
            m: '2月份',
            s: '15,000'
          },
          {
            m: '1月份',
            s: '15,000'
          }
        ],
      },
      {
        year: 2017,
        details: [
          {
            m: '5月份',
            s: '15,000'
          },
          {
            m: '4月份',
            s: '15,000'
          },
          {
            m: '3月份',
            s: '15,000'
          },
          {
            m: '2月份',
            s: '15,000'
          },
          {
            m: '1月份',
            s: '15,000'
          }
        ],
      }
    ];
  }

  getSalary(id) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    // data.push({createdDate: '2018-3-31', paidWages: 13500})
    var params = {
      personOid: id,
      wageStatus: 2
    }
    this.money.getMySalary(params).subscribe(data => {
      if(!data) {
        this.loading.dismiss();
      }else {
        data.forEach((item, i, l) => {
          var dataList = item.createdDate.split('-');
          var obj = {
            year: dataList[0],
            details: [
              {
                m: dataList[1] = dataList[1]<10? dataList[1].split('')[1]:dataList[1],
                details: [
                  {
                    s: item.paidWages,
                    isFirst: true
                  },
                  {
                    s: item.paidWages,
                  }
                ]
              },
            ]
          };
          if(!i) {
            this.list.push(obj);
          }else {
            if(dataList[0] == this.list[this.myIndex].year) {

              let temp = this.list[this.myIndex].details;
              for(let l=0; l<this.list[this.myIndex].details.length; l++) {
                if(dataList[1] == temp[l].m) {
                  temp[l].details.push({s: item.paidWages});
                  temp[l].details[0].s += item.paidWages ;
                  return;
                }else {
                  this.list[this.myIndex].details.unshift({m:dataList[1], details:[{s: item.paidWages,isFirst: true}, {s: item.paidWages}]})
                  return;
                }
              }
            }else {
              this.list.push(obj);
              this.myIndex += 1;
            }
          }
        });
        this.datas = this.list;
        this.datas[0].show = true;
        this.loading.dismiss();
      }
    },
    err => {
      this.loading.dismiss();
    });

  }

}

