import { Component } from '@angular/core';

@Component({
  selector: 'not-found',
  templateUrl: 'not-found.html'
})
export class NotFoundComponent {

  text: string;

  constructor() {
    console.log('Hello NotFoundComponent Component');
    this.text = 'Hello World';
  }

}
