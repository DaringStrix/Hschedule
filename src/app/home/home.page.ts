import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Horario } from '../models/horario.model';
import { HorarioComponent } from '../components/modals/horario/horario.component';

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
      console.log('trying to redirect...');
      
      if (this.primerHorario.length != 0) {        
        this.utsv.routerLink(this.primerHorario['0'].url)
      } else {
        this.addFirstHorario()
      }
    }
  }

  addFirstHorario() {
    this.utsv.presentModal({
      component: HorarioComponent,
      componentProps: {
        primaryColor: 'primary'
      },
      cssClass: 'modal-height'
    })
  }
}
