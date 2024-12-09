import { Exercise } from './exercise';
import {ModelBase} from './model-base';
import {Training} from './training';


export class TrainingExercise extends ModelBase{
  exercise: Exercise;
  training: Training;
  repetitions: string;
  series: string;
  rest_time: string;
  name: string;
}
