import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { AuthService } from '../shared/auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserProfile } from '../shared/models/user-profile';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map, Observable, shareReplay } from 'rxjs';

interface Menu {
  title: string;
  route: string;
  isCurrent: boolean;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, MatIcon, MatButton, RouterModule, MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  public menuList: Menu[];   //Armazena os itens do menu de navegação.
  public profile: UserProfile;  //Armazena os dados do perfil do usuário, carregados pelo resolver associado à rota.

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );  //Verifica se o dispositivo atual é um handset (celular)

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.route.data
      .subscribe((data) => {
        this.profile = data['userProfile'] as UserProfile;
      });
    this.menuList = [
      { title: 'TREINO', route: '/training', isCurrent: false },
      { title: 'DIETA', route: '/diet', isCurrent: false },
    ];
  }

  ngOnInit(): void {

  }

  logout(): void {
    this.authService.logout();
  }

}

//O MainComponent serve como o layout principal da aplicação.
//Ele incorpora funcionalidades como navegação, exibição do perfil do usuário, logout e adaptação da interface para
// dispositivos móveis.
