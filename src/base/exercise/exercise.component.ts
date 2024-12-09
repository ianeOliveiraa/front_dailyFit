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
  ],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.css'
})
export class ExerciseComponent implements OnInit {
  public dataSource: TrainingExercise[] = [];
  public displayedColumns = ['id', 'exercise', 'repetitions', 'series', 'rest_time', 'actions'];
  public training: Training;
  private router: Router = new Router();
  isSavingName = signal(false);

  private service: BaseService<TrainingExercise>
  private trainginService: BaseService<Training>
  public trainingName = "";

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.service = new BaseService<TrainingExercise>(http, URLS.TRAINING_EXERCISE);
    this.trainginService = new BaseService<Training>(http, URLS.TRAINING);
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
    this.service.addParameter("training", this.training.id.toString());
    this.service.getAll().subscribe({
      next: (data: TrainingExercise[]) => {
        this.dataSource = data;
        console.log('Training exercise load: ', data)
      },
      error: (err) => {
        console.error('Error loading training exercise');
      }
    });
  }

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

  public goToPage(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }

  public onClickNewTraining(): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["training", this.training.id.toString(), 'exercise', 'create'], extras).then();
  }

  public onClickEditTraining(trainingId): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["training", this.training.id.toString(), 'exercise', trainingId], extras).then();
  }


  clickEditName(event: MouseEvent) {
    if (this.isSavingName()) {
      return;
    }
    this.isSavingName.set(true);

    this.trainginService.update(this.training.id, {
      "id": this.training.id,
      "name": this.trainingName,
    } as Training).subscribe(() =>{
      this.training.name = this.trainingName;
      this.isSavingName.set(false);
    })
    event.stopPropagation();
  }

  public onBackClick() {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["../training"], extras).then();
  }
}


