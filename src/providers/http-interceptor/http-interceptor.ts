import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpHeaders, HttpEventType, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, TimeoutError } from 'rxjs';
import { ToastController, LoadingController, App, Events } from 'ionic-angular';
import { StorageProvider } from '../storage/storage';
import { LoginPage } from '../../pages/login/login';
import { ErrorPage } from '../../pages/error/error';
import { whiteList } from '../../config';


@Injectable()
export class HttpInterceptorProvider implements HttpInterceptor {

  loadingCount: number = 0; //页面请求多次，则不再展示加载框
  loading: any;

  createLoading() {
    if (this.loadingCount == 0) {
      this.loading = this.loadingCtrl.create({
        content: '处理中...'
      });
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


  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public storage: StorageProvider,
    public app: App,
    public events: Events
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers: HttpHeaders;

    if (this.storage.token) {
      headers = req.headers.set('Authorization', this.storage.token);
    }
    const appReq = req.clone({
      headers: headers
    });
    // this.createLoading();
    // console.log("start",this.loadingCount);
    // appReq.method!='GET' && loading.present();
    return next
      .handle(appReq).timeout(30000)
      .mergeMap((event: any) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // console.log(`${appReq.url}请求已发出`);
            break;
          case HttpEventType.UploadProgress:
            // console.log(`${appReq.url}收到上传进度事件`);
            break;
          case HttpEventType.ResponseHeader:
            // console.log(`${appReq.url}收到响应状态码和响应头`);
            break;
          case HttpEventType.DownloadProgress:
            // console.log(`${appReq.url}收到下载进度事件`);
            break;
          case HttpEventType.Response:
            // this.destroyLoading();
            // console.log("success",this.loadingCount);
            // console.log(`${appReq.url}收到响应对象`);
            let lastLink = event.url.split("/").slice(-1)[0];
            lastLink = (lastLink && lastLink.split("?")[0]) || "";
            if (whiteList.indexOf(lastLink) != -1) {
              break;
            }
            if (!event.body.flag) {
              return Observable.create(observer => observer.error(event));
            }
            break;
          case HttpEventType.User:
            // console.log(`${appReq.url}收到自定义事件`);
            break;
          default:
            break;
        }
        return Observable.create(observer => observer.next(event));
      })
      .catch((res: any) => {//捕获异常
        // this.destroyLoading();
        // console.log("catch",this.loadingCount);
        if (!navigator.onLine) { // 断网异常
          this.app.getRootNav().setRoot(ErrorPage);
          return Observable.throw(res);
        }
        let message = '';
        switch (res.status) {
          case 0:
            message = res.error ? res.error.message : res.message;
            break;
          case 200:
            // TODO: 处理业务逻辑
            // console.log(res, 'myRes')
            message = res.body.message;
            break;
          case 401:
            // TODO: 无权限处理
            this.app.getRootNav().setRoot(LoginPage);
            setTimeout(() => {
              this.storage.resetStorage();
            }, 500);
            message = res.error ? res.error.message : res.message;
            break;
          case 404:
            // TODO: 404 处理
            message = res.error ? res.error.message : res.message;
            break;
          case 500:
            // TODO: 500 处理
            message = res.error ? res.error.message : res.message;
            break;
          default:
            // 其他错误
            message = res.error ? res.error.message : res.message;
            if (res instanceof TimeoutError) {
              message = '请求超时';
            }
            break;
        }
        let toast = this.toastCtrl.create({
          cssClass: 'mini',
          message: message,
          position: 'middle',
          duration: 2000
        });
        toast.present();
        // 以错误的形式结束本次请求
        return Observable.throw(res);
      });
  }

}
