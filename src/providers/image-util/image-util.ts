import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActionSheetController, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { Observable } from 'rxjs';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class ImageUtilProvider {

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public base64: Base64,
    public toastCtrl:ToastController,
    public sanitizer: DomSanitizer,
    public storage: StorageProvider
  ) {
  }

  goSelectImage(callback, multiple?, options?) {
    let cameraOpt = {
      quality: 50,
      destinationType: 1,
      encodingType: 0,
      mediaType: 0,
      allowEdit: false,
      correctOrientation: true
    };
    let actionSheet = this.actionSheetCtrl.create({
      title: '请选择',
      buttons: [
        { text: '拍照', handler: () => {
          this.camera.getPicture(Object.assign({}, cameraOpt, {sourceType: 1})).then(
            img => {
              callback([img]);
            }
          ).catch(
            (err) => {}
          );
        } },
        { text: '从手机相册选择', handler: () => {
          if(multiple) {
            this.imagePicker.hasReadPermission().then(
              r => {
                if(!r) {
                  this.imagePicker.requestReadPermission().then(
                    () => {
                      this.imagePicker.getPictures(options).then(
                        imgs => {
                          callback(imgs);
                        }
                      ).catch(
                        (err) => {

                        }
                      );
                    }
                  );
                }else {
                  this.imagePicker.getPictures(options).then(
                    imgs => {
                      callback(imgs);
                    }
                  ).catch(
                    (err) => {

                    }
                  );
                }
              }
            );
          }else {
            this.camera.getPicture(Object.assign({}, cameraOpt, {sourceType: 0})).then(
              img => {
                callback([img]);
              }
            ).catch(
              (err) => {
                this.toastCtrl.create({
                  cssClass: 'mini',
                  position: 'middle',
                  message: '请选择图片',
                  duration: 1000
                }).present();
              }
            );
          }
        } },
        { text: '取消', role: 'cancel' }
      ]
    });
    actionSheet.present();
  }

  getDOMSafeUrl(img) {
    return Observable.fromPromise(this.base64.encodeFile(img)).mergeMap(
      (base64File) => {
        return Observable.create(observer => observer.next(this.sanitizer.bypassSecurityTrustResourceUrl(base64File)));
      }
    );
  }

  canvasToDataURL(canvas, format='image/jpeg', quality=1){
    return canvas.toDataURL(format, quality);
  }

  dataURLToBlob(dataurl){
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  imageToCanvas(src): Observable<any> {
    return new Observable((ob) => {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function (){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ob.next(canvas);
      };
      img.src = src;
    });
  }

  imageToBlob(src){
    return this.imageToCanvas(src).mergeMap((canvas) => {
      let blob: Blob = this.dataURLToBlob(this.canvasToDataURL(canvas));
      return Observable.create(observable => observable.next(blob));
    });
  }

}
