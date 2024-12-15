import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';  //Armazena o nome de usuário inserido no formulário
  password: string = '';  //Armazena a senha inserida no formulário
  errorMessage: string = '';  //Mensagem de erro exibida ao usuário em caso de falha no login

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/training');
      },
      error: () => {
        this.errorMessage = 'Login ou senha inválidos.';
      },
    });
  }
  //Utiliza o método login do AuthService, passando as credenciais do formulário (username e password).
}
