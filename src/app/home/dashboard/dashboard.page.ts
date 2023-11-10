import { Component, OnInit, inject } from '@angular/core';
import { delay } from 'rxjs';
import { Horario } from 'src/app/models/horario.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HorariosService } from 'src/app/services/horarios.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  utilsService = inject(UtilsService)
  firebaseService = inject(FirebaseService);
  horariosService = inject(HorariosService);

  public horarios: Horario[] = []
  public path: string

  constructor() { }

  ngOnInit() {
    if (this.user()) {
      this.path = `users/${this.user().uid}`;
    }
    this.getHorarios()
  }

  user(): User {
    return this.utilsService.getFromLocalStorge('user');
  }

  private getHorarios() {
    if (this.horarios.length == 0) {
      this.horarios = this.horariosService.getHorariosGuardados();
    }
  }

  async activarHorario(uid: string) {
    let path = this.path + `/horarios/${uid}`
    let data = await this.firebaseService.getDocument(path)
    this.firebaseService.updateDoc(path, { active: !data['active'] })
  }

  async duplicateHorario(uid: string) {
    const loading = await this.utilsService.loading()
    await loading.present()

    await this.firebaseService.duplicateDocument(this.path + '/horarios', uid)
      .finally(() => {
        this.utilsService.presentToast({
          message: `Horario duplicado correctamente`,
          duration: 1000,
          color: 'warning'
        }).finally(() => {
          this.horarios = []
          this.horariosService.getHorarios(this.path + '/horarios');
          this.getHorarios()
          loading.dismiss()
        })

      })
  }

  async deleteHorario(uid: string) {
    const loading = await this.utilsService.loading()
    await loading.present()

    this.firebaseService.deleteDocument(this.path + `/horarios/${uid}`)
      .finally(() => {
        this.utilsService.presentToast({
          message: `Horario borrado`,
          duration: 1000,
          color: 'warning'
        }).finally(async () => {
          this.horariosService.getHorarios(this.path + '/horarios');
          this.getHorarios()
          window.location.reload()
          loading.dismiss()
        })
      })
  }

  handleRefresh(event) {
    setTimeout(async () => {
      this.horarios = []
      await this.getHorarios();
      event.target.complete();
    }, 1000);
  }
}
