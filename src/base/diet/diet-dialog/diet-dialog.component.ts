import { OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseService } from '../../../shared/service/base.service';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URLS } from '../../../shared/urls';
import { DietComponent } from '../diet.component';
import { Meal } from '../../../shared/models/meal';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, MatOption, provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {MatSelect} from '@angular/material/select';
import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-diet-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diet-dialog.component.html',
  styleUrls: ['./diet-dialog.component.scss'],
})
export class DietDialogComponent implements OnInit {
  public formGroup: FormGroup;
  public dietService: BaseService<Meal>;

  meals: { value: number; viewValue: string }[] = [
    { value: 1, viewValue: "Café da manhã" },
    { value: 2, viewValue: "Lanche da manhã" },
    { value: 3, viewValue: "Almoço" },
    { value: 4, viewValue: "Lanche da tarde" },
    { value: 5, viewValue: "Jantar" },
    { value: 6, viewValue: "Ceia" },
    { value: 7, viewValue: "Pré-treino" },
    { value: 8, viewValue: "Pós-treino" },
    { value: 9, viewValue: "Lanche noturno" },
    { value: 10, viewValue: "Brunch" },
  ];  //lista os tipos de refeições disponíveis com seus valores e descrições (viewValue) - usado no select.

  constructor(private dialogRef: MatDialogRef<DietComponent>,
              private http: HttpClient,
              private router: Router) {
    this.dietService = new BaseService<Meal>(http, URLS.MEAL);
  }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      date: new FormControl('', Validators.required),
      meal_type: new FormControl('', Validators.required),
    });
  }

  onSave(): void {
    if (this.formGroup.valid) {
      // Copia os valores do formulário
      const formValue = { ...this.formGroup.value };

      // Formata a data antes de salvar
      if (formValue.date) {
        formValue.date = this.formatDate(formValue.date); // Formata a data no formato desejado
      }

      // Envia os dados para o serviço
      this.dietService.save(formValue as Meal).subscribe((response) => {
        this.dialogRef.close();
        this.router.navigate(['diet', response.id, 'diet-meal']); // Redireciona para a próxima página
      });
    }
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda no mês
    const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda no dia
    return `${year}-${month}-${day}`; // Retorna no formato ISO 8601 (YYYY-MM-DD)
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
