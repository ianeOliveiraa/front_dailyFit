import { Component, OnInit } from '@angular/core';
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
  ],
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
    })
  }

  onSave(): void {
    if (this.formGroup.valid) {
      this.trainingService.save(
        this.formGroup.value as Training).subscribe((response) => {
          this.dialogRef.close();
          this.router.navigate(["training", response.id, 'exercise'],);
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
