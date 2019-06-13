import { NgModule } from '@angular/core';
import { Autosize } from './autosize/autosize';
import { NotEmojiDirective } from './not-emoji/not-emoji';
import { ContentShadowDirective } from './content-shadow/content-shadow';
@NgModule({
	declarations: [Autosize,
    NotEmojiDirective,
    ContentShadowDirective],
	imports: [],
	exports: [Autosize,
    NotEmojiDirective,
    ContentShadowDirective]
})
export class DirectivesModule {}
