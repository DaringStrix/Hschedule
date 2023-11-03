import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Horario } from '../models/horario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utsv = inject(UtilsService)
  firebaseService = inject(FirebaseService);

  public primerHorario: Horario[] = [{
    uid: '0',
    title: 'horarioEjemplo',
    active: false,
    mode: 'lundom',
    color: 'primary',
    url: '/horarios/horarioEjemplo'
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
    this.getPrimerHorario()
  }


  getPrimerHorario(redirect: boolean = false) {
    if (this.utsv.getFromLocalStorge('horarios')) {
      this.primerHorario = this.utsv.getFromLocalStorge('horarios');
    }
    if (redirect) {
      this.utsv.routerLink(this.primerHorario['0'].url)
    }
  }
}
