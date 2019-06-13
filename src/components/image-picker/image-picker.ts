import { Component } from '@angular/core';
import { ImageUtilProvider } from '../../providers/image-util/image-util';

@Component({
  selector: 'image-picker',
  templateUrl: 'image-picker.html'
})
export class ImagePickerComponent {

  max = 9;

  images: any[] = [];

  constructor(
    public imageUtil: ImageUtilProvider
  ) {
  }

  selectImage() {
    this.imageUtil.goSelectImage((imgs) => {
      imgs.forEach((img) => {
        this.imageUtil.getDOMSafeUrl(img).subscribe(
          (safeUrl) => {
            this.images.push({
              img: img,
              safeUrl: safeUrl
            });
          }
        );
      });
    }, true, {
      maximumImagesCount: this.max - this.images.length,
      quality: 70
    });
  }

  removeImage(index) {
    this.images.splice(index, 1);
  }

}
