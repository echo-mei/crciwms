import { Directive, Renderer2, OnInit } from '@angular/core';
import { Content } from 'ionic-angular';

/**
 * Generated class for the ContentShadowDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[content-shadow]' // Attribute selector
})
export class ContentShadowDirective implements OnInit{

  constructor(public content:Content, public renderer2: Renderer2) {

  }

  ngOnInit():void {
    this.content.ionScroll.subscribe(($event: any) => {
      this.adjust();
   });
  }

  adjust():void {
    if(this.content.scrollTop>1){
      this.renderer2.addClass(this.content.getFixedElement(), "fixed-shadow");
    }else{
      this.renderer2.removeClass(this.content.getFixedElement(), "fixed-shadow");
    }
  }

}
