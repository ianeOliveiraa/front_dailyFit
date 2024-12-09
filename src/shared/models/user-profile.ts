import {ModelBase} from './model-base';
import { UserLogin } from './user-login';


export class UserProfile extends ModelBase{
  age: string;
  weight: string;
  height: string;
  login: UserLogin;
}
