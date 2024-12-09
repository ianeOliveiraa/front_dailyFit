import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardModule} from '@angular/material/card';
import { Training } from '../../shared/models/training';
import { URLS } from '../../shared/urls';
import { BaseService } from '../../shared/service/base.service';
import {NavigationExtras, Router} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TrainingDialogComponent } from './dialog/training-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-training',
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
    MatCardModule,
    MatToolbarModule,
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent implements OnInit{
  public dataSource: Training[] = [];
  public displayedColumns = ['id', 'name', 'actions'];
  public searchName: string = '';

  private router: Router = new Router();

  private service: BaseService<Training>

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.service = new BaseService<Training>(http, URLS.TRAINING);
  }

  public ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter('name', this.searchName);

    this.service.getAll().subscribe({
      next: (data: Training[]) => {
        this.dataSource = data;
        console.log('Training load: ', data)
      },
      error: (err) => {
        console.error('Error loading training');
      }
    });
  }

  public deleteObject(id: number): void {
    this.service.delete(id).subscribe({
      next: (_) => {
        this.search();
      },
      error: (_) => {
        console.error('Error deleting training');
      }
    });
  }

  public goToPage(trainingId: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate(["training", trainingId, 'exercise'], extras).then();
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(TrainingDialogComponent, {
      data: {name: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }
}
