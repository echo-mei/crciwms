import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class EventProvider {

  constructor(
    public events: Events
  ) {
  }

}

export declare const enum EVENT_NAMES {
  // 同意关注
  AGREE_ATTENTION = 'agree_attention',
  // 取消关注
  CANCEL_ATTENTION = 'cancel_attention'
}
