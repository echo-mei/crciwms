import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicApp, IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { AppVersion } from '@ionic-native/app-version';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { IonicImageLoader } from 'ionic-image-loader';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MultiPickerModule } from 'ion-multi-picker';
import { CalendarModule } from 'ion2-calendar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DirectivesModule } from '../directives/directives.module';

import { MyApp } from './app.component';

import { HttpProvider } from '../providers/http/http';
import { HttpInterceptorProvider } from '../providers/http-interceptor/http-interceptor';
import { StorageProvider } from '../providers/storage/storage';
import { UserProvider } from '../providers/user/user';
import { DateUtilProvider } from '../providers/date-util/date-util';
import { ImageUtilProvider } from '../providers/image-util/image-util';
import { DicProvider } from '../providers/dic/dic';

import { ImagePickerComponent } from '../components/image-picker/image-picker';
import { NotFoundComponent } from '../components/not-found/not-found';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

import { LoginPage } from '../pages/login/login';
import { IndexPage } from '../pages/index/index';
import * as VConsole from 'vconsole';
import { ErrorPage } from '../pages/error/error';
import { EventProvider } from '../providers/event/event';
import { SortablejsModule } from 'angular-sortablejs';
import { MyInfoPage } from '../pages/my-info/my-info';
import { MySalaryPage } from '../pages/my-salary/my-salary';
import { MyContractPage } from '../pages/my-contract/my-contract';
import { MyComplainPage } from '../pages/my-complain/my-complain';
import { SettingPage } from '../pages/setting/setting';
import { UpdatePasswordPage } from '../pages/update-password/update-password';
import { ContractProvider } from '../providers/contract/contract';
import { InfoProvider } from '../providers/info/info';
import { ComplainProvider } from '../providers/complain/complain';
import { SalaryProvider } from '../providers/salary/salary';
import { GetUpdateCodePage } from '../pages/get-update-code/get-update-code';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';

new VConsole();

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ErrorPage,
    IndexPage,
    MyInfoPage,
    MySalaryPage,
    MyContractPage,
    MyComplainPage,
    SettingPage,
    UpdatePasswordPage,
    GetUpdateCodePage,
    ForgetPasswordPage,
    ImagePickerComponent,
    NotFoundComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon:'md-left'
    }),
    IonicImageLoader.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule,
    MultiPickerModule,
    DirectivesModule,
    IonicImageViewerModule,
    ionicGalleryModal.GalleryModalModule,
    SortablejsModule.forRoot({ animation: 10 }),
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ErrorPage,
    IndexPage,
    MyInfoPage,
    MySalaryPage,
    MyContractPage,
    MyComplainPage,
    SettingPage,
    UpdatePasswordPage,
    GetUpdateCodePage,
    ForgetPasswordPage,
    ImagePickerComponent,
    NotFoundComponent,
    ProgressBarComponent
  ],
  providers: [
    File,
    Camera,
    Device,
    ImagePicker,
    Base64,
    StatusBar,
    SplashScreen,
    Keyboard,
    MobileAccessibility,
    ScreenOrientation,
    PhotoLibrary,
    FileOpener,
    FileTransfer,
    AppVersion,
    AndroidPermissions,
    {provide: HAMMER_GESTURE_CONFIG, useClass: ionicGalleryModal.GalleryModalHammerConfig},
    // {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorProvider, multi: true},
    HttpProvider,
    StorageProvider,
    UserProvider,
    DateUtilProvider,
    ImageUtilProvider,
    DicProvider,
    EventProvider,
    ContractProvider,
    InfoProvider,
    ComplainProvider,
    SalaryProvider
  ]
})
export class AppModule {

}
