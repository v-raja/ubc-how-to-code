import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: string): any {
    const length = value.length - 1;
    let result = '';
    for (let i = length; i >= 0; i--) {
      result += value.charAt(i);
    }
    return result;
  }

}
