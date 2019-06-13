import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ModalController, ActionSheetController } from 'ionic-angular';
import { InfoProvider } from '../../providers/info/info';
import { StorageProvider } from '../../providers/storage/storage';
import { ImageUtilProvider } from '../../providers/image-util/image-util';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GalleryModal } from 'ionic-gallery-modal';
import { PhotoLibrary } from '@ionic-native/photo-library';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'page-my-info',
  templateUrl: 'my-info.html',
})
export class MyInfoPage {

  person = {};
  sexName = "";//性别
  nationList = [];//民族列表
  imageList: Array<{ name: string, url: SafeResourceUrl, type: number, hasFlag: boolean }> = [
    { name: "身份证正面", url: "", type: 1, hasFlag: false },
    { name: "身份证反面", url: "", type: 2, hasFlag: false },
    { name: "银行卡正面", url: "", type: 3, hasFlag: false },
    { name: "手持身份证和银行卡照片", url: "", type: 4, hasFlag: false }
  ];

  showMoreText = "更多";
  unitShow: Boolean = false;
  // 更新首页数据
  onUpdate: () => {};

  loadingCount: number = 0; //页面请求多次，则不再展示加载框
  loading: any;

  createLoading() {
    if (this.loadingCount == 0) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    this.loadingCount++;
  }

  destroyLoading() {
    this.loadingCount--;
    if (this.loadingCount == 0) {
      this.loading.dismiss();
    }
  }

  constructor(public navCtrl: NavController,
    public domSanitizer: DomSanitizer,
    public navParams: NavParams,
    public info: InfoProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public imageUtil: ImageUtilProvider,
    public modalCtrl: ModalController,
    public photoLibrary: PhotoLibrary,
    public actionSheetCtrl: ActionSheetController,
    public storage: StorageProvider) {
    this.person = this.navParams.get("person");
    this.onUpdate = this.navParams.get("onUpdate");
    this.getInfo();
    this.getImg(1);
    this.getImg(2);
    this.getImg(3);
    this.getImg(4);
  }

  ionViewDidLeave() {
    this.onUpdate();
  }

  getInfo() {
    this.createLoading();
    this.info.getInfo(this.storage.personOid).subscribe(res => {
      this.destroyLoading();
      this.person = res;
      this.getNationList();
      if (this.person["sexCode"] == "1") this.sexName = "男";
      else if (this.person["sexCode"] == "2") this.sexName = "女";
      else this.sexName = "";
    },
      err => {
        this.destroyLoading();
      });
  }

  getNationList() {
    this.info.getDicItemList("JDRS0003").subscribe(res => {
      this.nationList = res;
      let nation = this.nationList.find(item => { return item.dicItemCode == this.person["nationCode"] });
      this.person["nationName"] = nation && nation.dicItemName;
    });
  }

  getImg(imageType) {
    const data = {
      personOid: this.storage.personOid,
      imageType: imageType
    };
    this.createLoading();
    this.info.getImage(data).subscribe(res => {
      this.destroyLoading();
      let imgInfo = this.imageList.find(item => item.type == imageType);
      // 请求图片异常的时候返回的是json格式,正常是blob格式：Blob {size: 186651, type: "text/xml",__proto__: Blob}
      if (res.type == "text/xml" && res.size != 0) {
        let imgUrl = `${window.URL.createObjectURL(res)}`;
        //解决图片路径自动添加unsafe的问题
        imgInfo.url = this.domSanitizer.bypassSecurityTrustResourceUrl(imgUrl);
        imgInfo.hasFlag = true;
      } else {
        imgInfo.url = "";
        imgInfo.hasFlag = false;
      }
    });
  }

  showMore() {
    this.unitShow = !this.unitShow;
    if (this.unitShow) {
      this.showMoreText = "收起";
    } else {
      this.showMoreText = "更多";
    }
  }

  uploadImg(imageType) {
    this.imageUtil.goSelectImage((img) => {
      let loading = this.loadingCtrl.create({
        content: '上传中，请稍等...'
      });
      loading.present();
      let params = {
        personOid: this.storage.personOid,
        imageType: imageType
      }
      let files;
      files = img.map((img) => {
        return { 'name': 'file', 'path': img };
      });
      this.info.uploadImage(params, files).subscribe(
        () => {
          loading.dismiss();
          this.toastCtrl.create({
            cssClass: 'mini',
            position: 'middle',
            message: '证照上传成功',
            duration: 1000
          }).present();
          this.getImg(imageType);
        },
        err => {
          loading.dismiss();
        }
      );
    });
  }

  viewImages(img) {
    let photos = [{ url: img.url }];
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: 0
    });
    modal.present().then(() => {
      modal.overlay['_ionCntRef'].nativeElement.querySelector('ion-slides').addEventListener("click", function () {
        modal.dismiss();
      });
      let timeOutEvent;
      modal.overlay['_ionCntRef'].nativeElement.querySelectorAll('ion-slide').forEach((slide, index) => {
        let hammertime = new Hammer(slide);
        hammertime.on('press', () => {
          this.actionSheetCtrl.create({
            buttons: [
              {
                text: '删除', handler: () => {
                  let params = { personOid: this.storage.personOid, imageType: img.type };
                  this.info.deleteImage(params).subscribe(res => {
                    this.toastCtrl.create({
                      cssClass: 'mini',
                      message: res,
                      position: 'middle',
                      duration: 1000
                    }).present();
                    this.getImg(img.type);
                    modal.dismiss();
                  })
                }
              },
              { text: '取消', role: 'cancel', cssClass: 'color: #000' }
            ]
          }).present();
        });
      });
    });
  }
}
