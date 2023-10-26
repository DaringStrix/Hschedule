import { Component, inject } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public horarios = [
    { title: 'Horario 1', url: '/horarios/horario 1' },
  ];

  public grupos = [
    { title: 'Grupo 1', url: '/grupos/grupo 1' },
  ];

  utsv = inject(UtilsService)
  firebaseService = inject(FirebaseService);

  constructor() { }

  cerrarSesion() {
    this.utsv.unsaveInLocalStorge('user')
    this.firebaseService.singOut()
    this.utsv.routerLink('/login')
  }

  activarHorario() { }

  activarGroupo() { }

  getHorarios(index: number) {
    return this.horarios[index].url ? this.horarios[index].url : 'login';
  }
}
