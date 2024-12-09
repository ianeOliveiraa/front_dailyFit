
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'unit',
  standalone: true
})
export class UnitPipe implements PipeTransform {
  transform(value: string | number): string {

    if (value === 1) {
      return 'ml';
    }
    if (value === 2) {
      return 'g';
    }
    if (value === 3) {

      return 'un';
    }

    return 'Desconhecido';
  }

}

