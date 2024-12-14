import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {AsyncPipe, DatePipe, NgClass} from '@angular/common';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import {DietDialogComponent} from './diet-dialog/diet-dialog.component';
import {Meal} from '../../shared/models/meal';
import {MealTypePipe} from './meal-type.pipe';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';


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
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    AsyncPipe,
    MatOption,
  ],
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.scss'
})
export class DietComponent implements OnInit {
  public dataSource: Meal[] = [];
  public displayedColumns = ['date', 'meal_type', 'total_calories', 'actions'];
  public searchMealType: string = '';
  private router: Router = new Router();
  private service: BaseService<Meal>

  public mealTypeControl = new FormControl('');
  public filteredOptions: Observable<string[]>;

  private options: string[] = [
    'Café da manhã',
    'Lanche da manhã',
    'Almoço',
    'Lanche da tarde',
    'Jantar',
    'Ceia',
    'Pré-treino',
    'Pós-treino',
    'Lanche noturno',
    'Brunch'
  ];


  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.service = new BaseService<Meal>(http, URLS.MEAL);
  }

  public ngOnInit(): void {
    this.filteredOptions = this.mealTypeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.mealTypeControl.valueChanges.subscribe(value => {
      this.search(value);
    });

    this.search();
  }

  public search(mealType: string = ''): void {
    this.service.clearParameter();
    this.service.addParameter('meal_type_label', mealType || '');
    // this.service.addParameter('date', this.searchDate);
    this.service.getAll().subscribe({
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
      data: {date: "", meal_type: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
//
//   public dataSource: Meal[] = [];
//   public displayedColumns = ['date', 'meal_type', 'total_calories', 'actions'];
//   public selectedMealType: string = ''; // Mantém o rótulo selecionado
//   public selectedMealTypeId: number | null = null; // Mantém o ID correspondente
//   public mealTypeControl = new FormControl('');
//   public filteredOptions: Observable<{ id: number, label: string }[]>;
//
//   private options: { id: number, label: string }[] = [
//     { id: 1, label: 'Café da manhã' },
//     { id: 2, label: 'Lanche da manhã' },
//     { id: 3, label: 'Almoço' },
//     { id: 4, label: 'Lanche da tarde' },
//     { id: 5, label: 'Jantar' },
//     { id: 6, label: 'Ceia' },
//     { id: 7, label: 'Pré-treino' },
//     { id: 8, label: 'Pós-treino' },
//     { id: 9, label: 'Lanche noturno' },
//     { id: 10, label: 'Brunch' },
//   ];
//
//   private service: BaseService<Meal>;
//
//   constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {
//     this.service = new BaseService<Meal>(http, URLS.MEAL);
//   }
//
//   public ngOnInit(): void {
//     // Configurar autocomplete com filtro
//     this.filteredOptions = this.mealTypeControl.valueChanges.pipe(
//       startWith(''),
//       map(value => this._filter(value || ''))
//     );
//
//     // Atualizar ID selecionado com base no rótulo
//     this.mealTypeControl.valueChanges.subscribe(value => {
//       this.selectedMealType = value; // Atualiza o rótulo selecionado
//       const matchedOption = this.options.find(option => option.label === value);
//       this.selectedMealTypeId = matchedOption ? matchedOption.id : null; // Atualiza o ID correspondente
//       this.search();
//     });
//
//     // Carregar refeições iniciais
//     this.search();
//   }
//
//   public search(): void {
//     this.service.clearParameter();
//     if (this.selectedMealTypeId) {
//       this.service.addParameter('meal_type_id', this.selectedMealTypeId.toString()); // Filtra pelo ID
//     }
//
//     this.service.getAll().subscribe({
//       next: (data: Meal[]) => {
//         this.dataSource = data;
//         console.log('Meal load: ', data);
//       },
//       error: (err) => {
//         console.error('Error loading meals', err);
//       }
//     });
//   }
//
//   public deleteObject(id: number): void {
//     this.service.delete(id).subscribe({
//       next: () => this.search(),
//       error: () => console.error('Error deleting meal'),
//     });
//   }
//
//   public goToPage(dietId: string): void {
//     const extras: NavigationExtras = { queryParamsHandling: 'merge' };
//     this.router.navigate(["diet", dietId, 'diet-meal'], extras).then();
//   }
//
//   public onAdd(): void {
//     const dialogRef = this.dialog.open(DietDialogComponent, {
//       data: { date: "", meal_type: "" },
//     });
//
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//       if (result !== undefined) {
//         this.search(); // Atualiza tabela após adicionar
//       }
//     });
//   }
//
//   private _filter(value: string): { id: number, label: string }[] {
//     const filterValue = value.toLowerCase();
//     return this.options.filter(option => option.label.toLowerCase().includes(filterValue));
//   }
// }


