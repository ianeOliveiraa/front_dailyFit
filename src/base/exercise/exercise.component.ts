import {Component, OnInit, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../shared/urls';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButtonModule, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {BaseService} from '../../shared/service/base.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {TrainingExercise} from '../../shared/models/training_exercise';
import { Training } from '../../shared/models/training';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [
    MatCard,
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    MatIconButton,
    MatIcon,
    FormsModule,
    MatFabButton,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuTrigger,
    MatMenu,
  ],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent implements OnInit {
  public dataSource: TrainingExercise[] = [];
  public displayedColumns = ['exercise', 'repetitions', 'series', 'rest_time', 'actions'];
  public training: Training;  //carrega o treino atual
  private router: Router = new Router();
  isSavingName = signal(false);  //Um sinal reativo que rastreia o estado de salvamento do nome do treino (ativo/inativo).

  private service: BaseService<TrainingExercise>
  private trainingService: BaseService<Training>

  public trainingName = "";  //Nome do treino, usado no campo de edição.

  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.service = new BaseService<TrainingExercise>(http, URLS.TRAINING_EXERCISE);
    this.trainingService = new BaseService<Training>(http, URLS.TRAINING);
    this.route.data
      .subscribe((data) => {
        this.training = data['training'] as Training;
        this.trainingName = this.training.name;
      });
  }

  public ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter("training", this.training.id.toString());  //Adiciona o ID do treino como filtro.
    this.service.getAll().subscribe({
      next: (data: TrainingExercise[]) => {
        this.dataSource = data;
        console.log('Training exercise load: ', data)
      },
      error: (err) => {
        console.error('Error loading training exercise');
      }
    });
  } //Carrega os exercícios associados ao treino atual (training.id).

  public deleteObject(id: number): void {
    this.service.delete(id).subscribe({
      next: (_) => {
        this.search();
      },
      error: (_) => {
        console.error('Error deleting training exercise');
      }
    });
  }

  public onClickNewTraining(): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["training", this.training.id.toString(), 'exercise', 'create'], extras).then();
  }

  public onClickEditTraining(trainingId): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["training", this.training.id.toString(), 'exercise', trainingId], extras).then();
  }


  // Atualizar Nome do Treino
  clickEditName(event: MouseEvent): void {
    if (this.isSavingName()) {
      return;
    }
    this.isSavingName.set(true);

    this.trainingService.update(this.training.id, {
      id: this.training.id,
      name: this.trainingName,
    } as Training).subscribe(() => {
      this.training.name = this.trainingName;
      this.isSavingName.set(false);

      this.openSnackBar('Nome atualizado com sucesso!', 'Fechar');
    }, (error) => {
      this.isSavingName.set(false);

      this.openSnackBar('Erro ao atualizar o nome', 'Fechar');
    });

    event.stopPropagation();
  }

  public onBackClick() {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["../training"], extras).then();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}


