import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public horarios = [
    { title: 'Horario 1', url: '/horarios/horario 1'},
  ];

  public grupos = [
    { title: 'Grupo 1', url: '/grupos/grupo 1'},
  ];

  constructor() { }

  cerrarSesion() { }

  activarHorario() { }

  activarGroupo() { }

  getHorarios(index: number){
    return this.horarios[index].url? this.horarios[index].url : '/login';
  }
}
