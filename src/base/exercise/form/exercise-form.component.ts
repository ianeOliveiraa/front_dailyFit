import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { URLS } from '../../../shared/urls';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatOption, MatSelect } from '@angular/material/select';
import { BaseService } from '../../../shared/service/base.service';
import { GroupMuscle } from '../../../shared/models/group_muscle';
import { Exercise } from '../../../shared/models/exercise';
import { TrainingExercise } from '../../../shared/models/training_exercise';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Training } from '../../../shared/models/training';
import { firstValueFrom } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatInputModule,
    MatCardModule,
    MatSelect,
    MatOption,
    MatToolbarModule,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss'
})
export class ExerciseFormComponent extends BaseComponent<TrainingExercise> implements OnInit {
  public formGroup: FormGroup;
  public object: TrainingExercise = new TrainingExercise(); //Objeto do tipo TrainingExercise que armazena os dados do exercício em edição ou criação.

  private grupoMuscularService: BaseService<GroupMuscle>;
  private exercicieService: BaseService<Exercise>

  public groupMuscle = []; //Array que armazena os grupos musculares carregados do backend
  public allExercise = []; //Array que armazena os exercícios carregados do backend
  public filterExercise = [];  //Exercícios filtrados com base no grupo muscular selecionado.
  public training: Training; //Treino associado ao exercício.
  private _router: Router = new Router();

  constructor(http: HttpClient, private route: ActivatedRoute,  private snackBar: MatSnackBar) {
    super(http, URLS.TRAINING_EXERCISE);
    this.grupoMuscularService = new BaseService<GroupMuscle>(http, URLS.GROUP_MUSCLE);
    this.exercicieService = new BaseService<Exercise>(http, URLS.EXERCISE);

    this.route.data  //Carrega Dados da Rota
      .subscribe((data) => {
        this.training = data['training'] as Training;
        const trainingExercise = data['trainingExercise'] as TrainingExercise;
        if (trainingExercise) {
          this.object = trainingExercise;
        } else {
          this.object = new TrainingExercise();
        }
      });
  }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      exercise: new FormControl('', Validators.required),
      repetitions: new FormControl('', Validators.required),
      series: new FormControl('', Validators.required),
      rest_time: new FormControl('', Validators.required),
      muscle_group: new FormControl('', Validators.required),
    })
    const promises = [];   //Carrega grupos musculares e exercícios do backend.
    promises.push(firstValueFrom(this.grupoMuscularService.getAll()));
    promises.push(firstValueFrom(this.exercicieService.getAll()));

    this.formGroup.get('muscle_group')?.valueChanges.subscribe(value => {
      this.filterExercise = this.allExercise.filter(exercicio => exercicio.muscle_group == value);
    });  //Filtra os exercícios com base no grupo muscular selecionado.

    Promise.all(promises).then((values) => {  //Aguarda que todas as promessas no array sejam resolvidas.
      this.groupMuscle = values[0];  //Lista de grupos musculares.
      this.allExercise = values[1];  //Lista de exercícios.
      if (this.object.id != null) {  //Se um exercício estiver sendo editado
        this.object.exercise = this.allExercise.find(f => f.id == this.object.exercise.id);  //Encontra o exercício correspondente em allExercise
        this.formGroup.get('exercise')?.setValue(this.object.exercise.id); //Preenche os campos do formulário com os dados do exercício
        this.formGroup.get('repetitions')?.setValue(this.object.repetitions);
        this.formGroup.get('series')?.setValue(this.object.series);
        this.formGroup.get('rest_time')?.setValue(this.object.rest_time);
        this.formGroup.get('muscle_group')?.setValue(this.object.exercise.muscle_group);
      }
    });

  }

  public saveOrUpdate(): void {
    if (this.formGroup.valid) { //Valida o formulário
      Object.keys(this.formGroup.getRawValue()).forEach((key: string) => {  //Atualiza o objeto object com os valores do formulário.
        const value = this.formGroup.getRawValue()[key];
        if (value !== null && value !== undefined) {
          this.object[key] = value;
        }
      });
      const exercise = this.allExercise.find(exercicio => exercicio.id == this.object['exercise']);
      this.object['training'] = this.training;
      this.object['exercise'] = exercise;

      if (this.object.id != null) {  //Salva ou atualiza o exercício no backend, exibindo mensagens de sucesso ou erro
        this.service.update(this.object.id, this.object).subscribe({
          next: (response) => {
            this.openSnackBar('Exercício atualizado com sucesso!', 'Fechar');
            this.goToListExercise();
          },
          error: (err) => {
            this.openSnackBar('Erro ao atualizar exercício. Tente novamente.', 'Fechar');
          },
        });
      } else {
        this.service.save(this.object).subscribe({
          next: (response) => {
            this.openSnackBar('Exercício salvo com sucesso!', 'Fechar');
            this.goToListExercise();
          },
          error: (err) => {
            this.openSnackBar('Erro ao salvar exercício. Tente novamente.', 'Fechar');
          },
        });
      }
    }
  }


  public goToListExercise() {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this._router.navigate(["training", this.training.id.toString(), "exercise"], extras).then();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }


}
