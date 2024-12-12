import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordValidator } from './password-validator';
import { AuthService } from '../../shared/auth/auth.service';
import { UserRegister } from '../../shared/models/user-register';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButtonModule, MatFabButton, MatIconButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatCard,
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,

  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  public registerForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    firstname: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required])
  },
    // add custom Validators to the form, to make sure that password and passwordConfirm are equal
    { validators: PasswordValidator.passwordsMatching }
  )

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
    const value = new UserRegister();
    value.email = this.registerForm.value.email;
    value.first_name = this.registerForm.value.firstname;
    value.last_name = this.registerForm.value.lastname;
    value.password = this.registerForm.value.password;
    this.authService.register(value).pipe(
      tap(() => this.router.navigate(['/login']))
    ).subscribe();
  }

  public onBackClick() {
    this.router.navigate(["../login"]).then();
  }
}
