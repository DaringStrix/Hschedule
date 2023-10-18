import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public horarios = [
    { title: 'Horario 1', url: '/horarios/horario', icon: 'mail' },
  ];
  public grupos = [
    { title: 'Grupo 1', url: '/grupo/grupo', icon: 'mail' },
  ];
  constructor() { }

  cerrarSesion() { }

  activarHorario() { }

  activarGroupo() { }
}
