import {Component, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../shared/models/user-profile';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../../shared/service/base.service';
import { HttpClient } from '@angular/common/http';
import { URLS } from '../../shared/urls';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatButton,
    MatCardModule,
    MatToolbarModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userProfile: UserProfile;   //Armazena os dados do perfil do usuário.

  private service: BaseService<UserProfile>
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.service = new BaseService<UserProfile>(http, URLS.USERPROFILE + "update_profile/");
    this.route.parent.data
      .subscribe((data) => {
        this.userProfile = data['userProfile'] as UserProfile;
      });

    //Obtém os dados resolvidos pela rota (informações do perfil do usuário)
    //A propriedade userProfile é preenchida com os dados.
  }

  onSubmit(): void {
    this.service.save(this.userProfile).subscribe({
      next: () => {
        this.openSnackBar('Perfil atualizado com sucesso!', 'Fechar');
      },
      error: () => {
        this.openSnackBar('Erro ao atualizar perfil. Tente novamente.', 'Fechar');
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }


}
