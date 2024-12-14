import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MealFood} from '../../../shared/models/meal_food';
import {BaseService} from '../../../shared/service/base.service';
import {Food} from '../../../shared/models/food';
import {Meal} from '../../../shared/models/meal';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';
import {firstValueFrom} from 'rxjs';
import {BaseComponent} from '../../base.component';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {DietMealComponent} from '../diet-meal.component';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-foods-form-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatError,
    MatAutocompleteModule,
  ],
  templateUrl: './foods-form-dialog.component.html',
  standalone: true,
  styleUrl: './foods-form-dialog.component.scss'
})
export class FoodsFormDialogComponent  extends BaseComponent<MealFood> implements OnInit {

  public formGroup: FormGroup;
  public object: MealFood = new MealFood();
  private foodService: BaseService<Food>;
  public foods: Food[] = [];
  public meal: Meal;
  private _router: Router = new Router();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  filteredOptions: Food[];

  constructor(
    private dialogRef: MatDialogRef<DietMealComponent>,
    http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(http, URLS.MEAL_FOOD);
    this.foodService = new BaseService<Food>(http, URLS.FOOD);

    if (data) {
      this.meal = data.meal;
      this.object = data.food ?? new MealFood();
    }
  }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      description: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    });

    firstValueFrom(this.foodService.getAll()).then((data) => {
      this.foods = data;
      if (this.object.id != null) {
        this.object.food = this.foods.find(f => f.id == this.object.food.id);
        this.formGroup.get('description')?.setValue(this.object.food);
        this.formGroup.get('value')?.setValue(this.object.value);
      }
    });
  }

  public saveOrUpdate(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;

      this.object.meal = this.meal;
      this.object.food = formData.description;
      this.object.value = formData.value;

      if (this.object.id != null) {
        this.service.update(this.object.id, this.object).subscribe(() => {
          this.dialogRef.close();
          this.goToListDiet();
        });
      } else {
        this.service.save(this.object).subscribe(() => {
          this.dialogRef.close();
          this.goToListDiet();
        });
      }
    }
  }

  public goToListDiet() {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this._router.navigate(["diet", this.meal.id.toString(), "diet-meal"], extras).then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.foods.filter(o => o.description.toLowerCase().includes(filterValue));
  }

  displayFn(option: any): string {
    return option ? option.description : '';
  }
}
