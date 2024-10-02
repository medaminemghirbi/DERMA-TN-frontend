import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstKeyValue'
})
export class FirstKeyValuePipe implements PipeTransform {
  transform(value: any): { key: string; value: string } | null {
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length > 0) {
        return { key: keys[0], value: value[keys[0]] };
      }
    }
    return null;
  }
}
