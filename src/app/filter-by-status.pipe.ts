import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {
  transform(consultations: any[], status: string): any[] {
    if (!status || status === '') {
      return consultations; // No filter applied, return all consultations
    }
    return consultations.filter(item => item.status === status);
  }
}