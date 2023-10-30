import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { FirebaseService } from './services/firebase.service';
import { HorariosService } from './services/horarios.service';
import { Horarios } from './models/horario.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public horarios: Horarios[];

  public grupos = [
    { title: 'Grupo 1', url: '/grupos/grupo 1' },
  ];

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  horariosService = inject(HorariosService);

  isCuenta = localStorage.getItem('user');

  cuenta!: string;

  

  constructor() { }

  ngOnInit(): void {

    if (this.isCuenta != null) {
      this.cuenta = JSON.parse(localStorage.getItem('user')).email;
    }

    this.horariosService.getHorarios().then(res => {this.horarios = res});
  }

  cerrarSesion() {
    this.utilsService.unsaveInLocalStorge('user');
    this.firebaseService.singOut();
    this.utilsService.routerLink('/login');
  }

  activarHorario() { }

  activarGroupo() { }

  // getHorarios(index: number) {
  //   return this.horarios[index].url ? this.horarios[index].url : 'login';
  // }
}
