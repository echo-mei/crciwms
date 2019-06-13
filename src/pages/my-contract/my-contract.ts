import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StorageProvider } from '../../providers/storage/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BASE_URL } from '../../config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContractProvider } from '../../providers/contract/contract';
import { FileOpener } from '@ionic-native/file-opener';
declare let cordova: any;
declare let window: any;
@Component({
  selector: 'page-my-contract',
  templateUrl: 'my-contract.html',
})
export class MyContractPage {

  datas: Object = {};
  fPath: any;
  fileName: any;
  imageList: Array<SafeResourceUrl> = [];
  // 更新首页数据
  onUpdate:()=>{};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: ContractProvider,
    public storage: StorageProvider,
    public transfer: FileTransfer,
    public file: File,
    public domSanitizer: DomSanitizer,
    public fileOpener: FileOpener,
    public contract: ContractProvider,
    public loadingCtrl: LoadingController
  ) {
    this.onUpdate = this.navParams.get("onUpdate");
    this.getContractInfo(this.storage.personOid);
  }

  ionViewDidLeave() {
    this.onUpdate();
  }

  getContractInfo(id) {
    this.contract.getContarctInfo({ personOid: id }).subscribe(data => {
      this.datas = data;
      let contractPath = data.contractPath;
      if (contractPath) {
        let spt: any;
        if (contractPath.indexOf("\\") != -1) {
          spt = contractPath.split('\\');
        } else if (contractPath.indexOf("/") != -1) {
          spt =contractPath.split('/');
        }
        this.fileName = spt[spt.length - 1] || '';
      }
    })
  }

  getContract() {
    let me = this;
    let fileName = this.storage.personOid + '.pdf';
    this.file.checkFile('file:///data/data/org.jade.iglms/cache/', fileName).then(data => {
      console.log(data, 'success');
      me.fileOpener.open('file:///data/data/org.jade.iglms/cache/' + fileName, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    }, (error) => {
      console.log(error, 'error')
      let loading = this.loadingCtrl.create({
        content: '下载中，请稍等...'
      });
      loading.present();
      this.user.getContarctPDF1({ personOid: this.storage.personOid }).subscribe(data => {
        console.log(data, 'data111');
        console.log(window.TEMPORARY, 'temp space')
        window.requestFileSystem(window.TEMPORARY, 1000 * 1024 * 1024, function (fs) {

          console.log('file system open: ' + fs.name);
          createFile(fs.root, fileName, false);

        });
        function createFile(dirEntry, fileName, isAppend) {
          // Creates a new file or returns the file if it already exists.
          dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

            writeFile(fileEntry, null, isAppend);

          });
          function writeFile(fileEntry, dataObj, isAppend) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

              fileWriter.onwriteend = function (w) {
                console.log("Successful file write...");
                console.log(fileEntry, 'fienty')
                console.log(w, 'cbk')
                console.log(fileEntry.nativeURL, 'url')

                me.fileOpener.open('file:///data/data/org.jade.iglms/cache/' + fileName, 'application/pdf')
                  .then(() => {
                    loading.dismiss();
                    console.log('File is opened');
                  })
                  .catch(e => console.log('Error opening file', e));
                // readFile(fileEntry);
              };

              fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
              };

              // If data object is not passed in,
              // create a new Blob instead.
              // if (!dataObj) {
              //     dataObj = new Blob(['data'], { type: 'application/pdf' });
              // }

              fileWriter.write(data);
            });
            function readFile(fileEntry) {

              fileEntry.file(function (file) {
                var reader = new FileReader();
                console.log(file, 'filefile')
                reader.onloadend = function () {
                  // console.log("Successful file read: " + this.result);
                };

                reader.readAsText(file);

              });
            }
          }

        }
      })
    })






  }

}



