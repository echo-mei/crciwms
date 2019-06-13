import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Events, Platform, App, NavController, ToastController, IonicApp, ModalController, LoadingController } from 'ionic-angular';
import { StorageProvider } from '../providers/storage/storage';
import { UserProvider } from '../providers/user/user';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginPage } from '../pages/login/login';
import { Keyboard } from '@ionic-native/keyboard';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { BASE_URL } from '../config';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Device } from '@ionic-native/device';
import { IndexPage } from '../pages/index';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('mask') mask: ElementRef;

  canExit = false;

  rootPage;

  keyboardIsShow: boolean;

  hasNewApk: boolean = false;

  showProgress: boolean = false;

  progress: number = 0;

  constructor(
    public splashScreen: SplashScreen,
    public app: App,
    public platform: Platform,
    public storage: StorageProvider,
    public userProvider: UserProvider,
    public events: Events,
    public toastCtrl: ToastController,
    public statusBar: StatusBar,
    public eleRef: ElementRef,
    public renderer2: Renderer2,
    public ionicApp: IonicApp,
    public keyboard: Keyboard,
    public mobileAccessibility: MobileAccessibility,
    public screenOrientation: ScreenOrientation,
    public modalCtrl: ModalController,
    public transfer: FileTransfer,
    public fileOpener: FileOpener,
    public loadingCtrl: LoadingController,
    public appVersion: AppVersion,
    public file: File,
    public androidPermissions: AndroidPermissions,
    public device: Device
  ) {
    // this.platform.ready().then(
    //   (p) => {
    //     this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]).then(
    //       () => {
    //         this.checkNewApk();
    //       }
    //     );
    //   }
    // );
    this.ready();
  }

  checkNewApk() {
    this.userProvider.getVersionNumber().subscribe(
      data => {
        // 比较版本号
        this.appVersion.getVersionNumber().then(
          currentVersion => {
            if(currentVersion==data) {
              this.ready();
            }else {
              this.hasNewApk = true;
            }
          }
        );
      },
      err => {
        let toast = this.toastCtrl.create({
          cssClass: 'mini',
          message: '检查版本出错',
          position: 'middle',
          duration: 2000
        });
        toast.present();
      }
    );
  }

  requestPermission(permission): Promise<any> {
    return new Promise((resolve, reject) => {
      this.androidPermissions.requestPermission(permission).then(
        r => {
          resolve();
        }
      ).catch(
        err => {
          reject(err);
        }
      );
    });
  }

  ready() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    this.mobileAccessibility.usePreferredTextZoom(false);
    this.statusBar.overlaysWebView(true);
    this.statusBar.styleDefault();
    this.platform.registerBackButtonAction(() => {
      let activeNav: NavController = this.app.getActiveNavs()[0];
      let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();
      let loadingPortal = this.ionicApp._loadingPortal.getActive();
      if(this.keyboardIsShow){

      }else if(activePortal) {
        activePortal.dismiss();
      }else if(loadingPortal) {

      }else if(this.ionicApp._getActivePortal()) {
        this.ionicApp._getActivePortal().dismissPageChangeViews();
      }else if(activeNav.canGoBack()) {
        activeNav.pop();
      }else {
        if(this.canExit) {
          this.platform.exitApp();
        }else {
          this.toastCtrl.create({
            cssClass: 'mini',
            message: '再按一次退出应用',
            position: 'bottom',
            duration: 2000
          }).present();
          this.canExit = true;
          setTimeout(() => {
            this.canExit = false;
          }, 2000);
        }
      }
    });
    this.setRoot();
    // 阻止多次点击
    this.app.viewWillEnter.subscribe(() => {
      this.mask.nativeElement.style.display = 'block';
    });
    this.app.viewDidEnter.subscribe(() => {
      this.mask.nativeElement.style.display = 'none';
    });
    // 弹出输入框
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.keyboardIsShow = true;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.keyboardIsShow = false;
    });
  }

  setRoot() {
    if(this.storage.token) {
      this.rootPage = IndexPage;
    }else {
      this.rootPage = LoginPage;
    }
  }

  // 下载并安装apk
  installApk() {
    this.showProgress = true;
    let progress = 0;
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.onProgress(progressEvent => {
      let present = Number.parseInt(progressEvent.loaded / progressEvent.total * 100 + '');
      progress = present;
    });
    let timer = setInterval(() => {
      this.progress = progress;
      if (this.progress >= 100) {
        clearInterval(timer);
      }
    }, 100);
    fileTransfer.download(`${BASE_URL}/versionupdates/downloadApk`, this.file.externalDataDirectory+'iglms.apk').then((entry) => {
      console.log(this.progress);
      this.showProgress = false;
      this.progress = 0;
      this.fileOpener.open(entry.toURL(), "application/vnd.android.package-archive")
        .then((r) => {})
        .catch(e => {
          let toast = this.toastCtrl.create({
            cssClass: 'mini',
            message: '安装包解析失败',
            position: 'middle',
            duration: 2000
          });
          toast.present();
        });
    }, (error) => {
      this.showProgress = false;
      this.progress = 0;
      let toast = this.toastCtrl.create({
        cssClass: 'mini',
        message: '下载失败',
        position: 'middle',
        duration: 2000
      });
      toast.present();
    });
  }
}

