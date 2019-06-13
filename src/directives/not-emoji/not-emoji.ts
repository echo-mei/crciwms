import { Directive, Input } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[notEmoji]'
})
export class NotEmojiDirective implements Validator {

  validate(control: AbstractControl): {[key: string]: any} | null {
    return notEmojiValidator()(control);
  }

}

export function notEmojiValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let ranges = '(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])';
    const hasEmoji = control.value.match(new RegExp(ranges, 'g'));
    return hasEmoji ? {'emoji': {value: control.value}} : null;
  };
}
