import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Horario } from '../models/horario.model';
import { HorarioComponent } from '../components/modals/horario/horario.component';
import { User } from '../models/user.model';
import { Grupo } from '../models/grupo.model';
import { GrupoComponent } from '../components/modals/grupo/grupo.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utilsService = inject(UtilsService)
  firebaseService = inject(FirebaseService);
  user: User

  public primerHorario: Horario[] = [{
    uid: '0',
    title: 'HorarioEjemplo',
    active: false,
    mode: 'lundom',
    color: 'primary',
    url: '/horarios/primerHorario'
  }];
  
  public primerGrupo: Grupo[] = [{
    uid: '0',
    title: 'HorarioEjemplo',
    active: false,
    lastDayOfWeek: new Date(),
    url: '/horarios/primerHorario'
  }];

  async cerrarSesion() {
    const loading = await this.utilsService.loading()
    await loading.present()

    this.utilsService.clearLocalStorge()
    await this.firebaseService.singOut().then(() => {
      window.location.reload()
      loading.dismiss()
      this.utilsService.presentToast({
        message: `Se ha cerrado la sesión`,
        duration: 1000,
        color: 'warning'
      })
    })
  }

  constructor() { }

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorge('user');
    this.getPrimerHorario()
  }


  getPrimerHorario(redirect: boolean = false) {
    if (this.utilsService.getFromLocalStorge('horarios')) {
      this.primerHorario = this.utilsService.getFromLocalStorge('horarios');
    }
    if (redirect) {
      if (this.primerHorario.length != 0) {
        this.utilsService.routerLink("/home/dashboard")
      } else {
        this.addFirstHorario()
      }
    }
  }

  addFirstHorario() {
    if (this.user) {
      this.utilsService.presentModal({
        component: HorarioComponent,
        componentProps: {
          primaryColor: 'primary'
        },
        cssClass: 'modal-height'
      })
    } else {
      this.utilsService.routerLink('login')
    }
  }

  getPrimerGrupo(redirect: boolean = false) {
    if (this.utilsService.getFromLocalStorge('grupos')) {
      this.primerGrupo = this.utilsService.getFromLocalStorge('grupos');
    }
    if (redirect) {
      if (this.primerGrupo.length != 0) {
        this.utilsService.routerLink(this.primerGrupo['0'].url)
      } else {
        this.addFirstGrupo()
      }
    }
  }

  addFirstGrupo() {
    if (this.user) {
      this.utilsService.presentModal({
        component: GrupoComponent,
        cssClass: 'modal-height'
      })
    } else {
      this.utilsService.routerLink('login')
    }
  }
}
