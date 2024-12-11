import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrainingComponent } from '../training.component';
import { BaseService } from '../../../shared/service/base.service';
import { Training } from '../../../shared/models/training';
import { HttpClient } from '@angular/common/http';
import { URLS } from '../../../shared/urls';
import { Router } from '@angular/router';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon
} from '@angular/material/datepicker';
import {MatIcon} from '@angular/material/icon';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-training-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatIcon,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './training-dialog.component.html',
  styleUrl: './training-dialog.component.css'
})
export class TrainingDialogComponent implements OnInit {

  public formGroup: FormGroup;

  public trainingService: BaseService<Training>;

  constructor(private dialogRef: MatDialogRef<TrainingComponent>,
    private http: HttpClient,
    private router: Router) {
    this.trainingService = new BaseService<Training>(http, URLS.TRAINING);
  }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
    })
  }

  onSave(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value; // Obtém os valores do formulário

      // Verifica se o campo de data existe e é válido antes de formatar
      if (formValue.date) {
        formValue.date = this.formatDate(new Date(formValue.date)); // Formata a data no formato desejado
      }

      // Salva os dados usando o serviço
      this.trainingService.save(formValue as Training).subscribe((response) => {
        this.dialogRef.close(); // Fecha o diálogo após salvar
        this.router.navigate(["training", response.id, 'exercise']); // Redireciona para a página de exercícios
      });
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda no mês
    const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda no dia
    return `${year}-${month}-${day}`; // Retorna no formato ISO 8601 (YYYY-MM-DD)
  }
}
