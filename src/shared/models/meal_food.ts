import {ModelBase} from './model-base';
import {Meal} from './meal';
import {Food} from './food';

export class MealFood extends ModelBase{
  meal: Meal;
  food: Food;
  value: string;

}
