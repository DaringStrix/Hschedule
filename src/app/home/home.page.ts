import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { HorariosService } from '../services/horarios.service';
import { Horario } from '../models/horario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utsv = inject(UtilsService)
  firebaseService = inject(FirebaseService);
  horariosService = inject(HorariosService);
  public primerHorario: Horario[] = [{
    uid: '0',
    title: 'horarioEjemplo',
    active: true,
    mode: 'lundom',
    color: 'primary',
    url: '/horarios/horario de Ejemplo'
  }];

  async cerrarSesion() {
    const loading = await this.utsv.loading()
    await loading.present()

    this.utsv.clearLocalStorge()
    await this.firebaseService.singOut().then(() => {
      window.location.reload()
      loading.dismiss()
      this.utsv.presentToast({
        message: `Se ha cerrado la sesión`,
        duration: 1000,
        color: 'warning'
      })
    })
  }

  constructor() { }

  ngOnInit() {
    if (this.utsv.getFromLocalStorge('horarios')) {
      this.primerHorario = this.utsv.getFromLocalStorge('horarios')
    }

  }

}
