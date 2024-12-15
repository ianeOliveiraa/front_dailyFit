import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import { URLS } from '../../shared/urls';
import { BaseService } from '../../shared/service/base.service';
import {NavigationExtras, Router, RouterLink} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {DatePipe, NgClass} from '@angular/common';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import {TrainingDialogComponent} from '../training/dialog/training-dialog.component';
import {MealFood} from '../../shared/models/meal_food';
import {DietDialogComponent} from './diet-dialog/diet-dialog.component';
import {Meal} from '../../shared/models/meal';
import {MealTypePipe} from './meal-type.pipe';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [
    MatCard,
    MatTableModule,
    MatFormFieldModule,
    MatIconButton,
    MatIcon,
    FormsModule,
    MatFabButton,
    MealTypePipe,
    MatCardContent,
    MatToolbar,
    MatToolbarRow,
    DatePipe,
    MatMenu,
    MatMenuTrigger,
  ],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.scss'
})
export class DietComponent implements OnInit{
  public dataSource: Meal[] = [];  //Fonte de dados para a tabela de refeições
  public displayedColumns = ['date', 'meal_type', 'total_calories', 'actions'];

  private router: Router = new Router();  //Usado para navegação entre páginas.

  private service: BaseService<Meal>  //interagir com o endpoint de refeições (URLS.MEAL).

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.service = new BaseService<Meal>(http, URLS.MEAL);
  }

  public ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.getAll().subscribe({  //Carregar a lista de refeições do backend.
      next: (data: Meal[]) => {
        this.dataSource = data;
        console.log('Meal load: ', data)
      },
      error: (err) => {
        console.error('Error loading meals');
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

  public goToPage(dietId: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["diet", dietId, 'diet-meal'], extras).then();
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(DietDialogComponent, {
      data: { date: "", meal_type: "" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }
}
