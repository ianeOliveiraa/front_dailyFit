import {Component, OnInit, signal} from '@angular/core';
import {MealFood} from '../../shared/models/meal_food';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {BaseService} from '../../shared/service/base.service';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../shared/urls';
import {Meal} from '../../shared/models/meal';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MealTypePipe} from '../diet/meal-type.pipe';
import {UnitPipe} from './unit.pipe';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FoodsFormDialogComponent} from './foods-form-dialog/foods-form-dialog.component';
import {Food} from '../../shared/models/food';
import {DatePipe} from '@angular/common';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-diet-meal',
  standalone: true,
  imports: [
    MatCard,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFabButton,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    ReactiveFormsModule,
    FormsModule,
    MatHeaderCellDef,
    MatToolbar,
    MatToolbarRow,
    MatCardContent,
    MealTypePipe,
    UnitPipe,
    DatePipe,
    MatMenu,
    MatMenuTrigger
  ],
  templateUrl: './diet-meal.component.html',
  styleUrl: './diet-meal.component.scss'
})
export class DietMealComponent implements OnInit{
  public dataSource: MealFood[] = [];
  public displayedColumns = ['description', 'total_kcal', 'value', 'unit', 'actions'];
  public meal: Meal;  //Representa a refeição associada aos alimentos carregados.
  private router: Router = new Router();
  private service: BaseService<MealFood>

  constructor(private http: HttpClient, private route: ActivatedRoute,  private dialog: MatDialog) {
    this.service = new BaseService<MealFood>(http, URLS.MEAL_FOOD);

    this.route.data   //Esses dados geralmente são obtidos através de Resolvers configurados na definição da rota.
      .subscribe((data) => {
        this.meal = data['meal'] as Meal;
      });
  }

  public ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter("diet", this.meal.id.toString());
    this.service.getAll().subscribe({  //Carrega os alimentos associados à refeição do backend.
      next: (data: MealFood[]) => {
        this.dataSource = data;
        console.log('diet-meal load: ', data)
      },
      error: (err) => {
        console.error('Error loading diet-meal');
      }
    });
  }

  public deleteObject(id: number): void {
    this.service.delete(id).subscribe({
      next: (_) => {
        this.search();
      },
      error: (_) => {
        console.error('Error deleting meal');
      }
    });
  }

  public onClickEditDiet(mealFood: MealFood): void {
    const dialogRef = this.dialog.open(FoodsFormDialogComponent, {
      data: { meal: this.meal, food: mealFood },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }//Abre um modal para editar um alimento associado à refeição, passando os dados da refeição e do alimento

  public onBackClick(): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["diet"], extras).then();
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(FoodsFormDialogComponent, {
      data: { meal: this.meal, description: "", value: "" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }
 //Abre um modal para adicionar um novo alimento à refeição.
}
