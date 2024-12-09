
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'mealType',
  standalone: true
})
export class MealTypePipe implements PipeTransform {
  transform(value: string | number): string {

    if (value === 1) {
      return 'Café da Manhã';
    }
    if (value === 2) {
      return 'Lanche da Manhã';
    }
    if (value === 3) {

      return 'Almoço';
    }
    if (value === 4) {
      return 'Lanche da Tarde';
    }
    if (value === 5) {
      return 'Jantar';
    }
    if (value === 6) {
      return 'Ceia';
    }
    if (value === 7) {
      return 'Pré-Treino';
    }
    if (value === 8) {
      return 'Pós-Treino';
    }
    if (value === 9) {
      return 'Lanche Noturno';
    }
    if (value === 10) {
      return 'Brunch';
    }
    return 'Desconhecido';
  }

}
