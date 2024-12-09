import { Routes } from '@angular/router';
import { LoginComponent } from '../base/login/login.component';
import { AuthGuard } from '../shared/auth/auth.guard';
import { MainComponent } from '../base/main.component';
import { UserProfileResolver } from '../shared/resolver/user-profile.resolver';
import { ProfileComponent } from '../base/profile/profile.component';
import { ExerciseComponent } from '../base/exercise/exercise.component';
import { ExerciseFormComponent } from '../base/exercise/form/exercise-form.component';
import { TrainingComponent } from '../base/training/training.component';
import { TrainingResolver } from '../shared/resolver/training.resolver';
import { TrainingExerciseResolver } from '../shared/resolver/training-exercise.resolver';
import { RegisterComponent } from '../base/register/register.component';
import {DietComponent} from '../base/diet/diet.component';
import {DietMealComponent} from '../base/diet-meal/diet-meal.component';
import { MealResolver} from '../shared/resolver/meal';
import {MealFoodResolver} from '../shared/resolver/meal-food.resolver';
import {FoodsFormDialogComponent} from '../base/diet-meal/foods-form-dialog/foods-form-dialog.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: "",
    component: MainComponent,
    resolve: {
      userProfile: UserProfileResolver,
    },
    children: [
      {
        path: 'userprofile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'training',
        component: TrainingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'training/:trainingId/exercise',
        component: ExerciseComponent,
        canActivate: [AuthGuard],
        resolve: {
          training: TrainingResolver,
        }
      },
      {
        path: 'training/:trainingId/exercise/:action',
        component: ExerciseFormComponent,
        canActivate: [AuthGuard],
        resolve: {
          training: TrainingResolver,
          trainingExercise: TrainingExerciseResolver,
        }
      },
      {
        path: 'diet',
        component: DietComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'diet/:mealId/diet-meal',
        component: DietMealComponent,
        canActivate: [AuthGuard],
        resolve: {
          meal: MealResolver,
        }
      },
      {
        path: 'diet/:mealId/diet-meal/:action',
        component: FoodsFormDialogComponent,
        canActivate: [AuthGuard],
        resolve: {
          meal: MealResolver,
          mealFood: MealFoodResolver,
        }
      },

    ],
  },
  {
    path: '',
    redirectTo: '/training',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/training'
  },
];
