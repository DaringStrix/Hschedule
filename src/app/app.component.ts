import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { FirebaseService } from './services/firebase.service';
import { HorariosService } from './services/horarios.service';
import { Horario } from './models/horario.model';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  horariosService = inject(HorariosService);

  public horarios: Horario[] = [];
  public grupos = [
    { title: 'Grupo 1', url: '/grupos/grupo 1' },
  ];
  public cuenta!: string;
  public submenuVisible: boolean = false
  public submenuId: string = ''
  private path = ''

  constructor() { }

  user(): User {
    return this.utilsService.getFromLocalStorge('user');
  }

  async ngOnInit() {

    if (this.user()) {
      this.path = `users/${this.user().uid}/horarios`;
    }

    await this.getData();
  }

  private async getData() {
    if (localStorage.getItem('user')) {
      this.cuenta = await JSON.parse(localStorage.getItem('user')).email;
    }
    if (this.horarios.length == 0) {
      await this.horariosService.getHorarios(this.path).then(res => { this.horarios = res; });
    }
  }

  cerrarSesion() {
    this.utilsService.unsaveInLocalStorge('user');
    this.firebaseService.singOut();
    this.utilsService.routerLink('/login');
  }

  redirect(url: string) {
    this.utilsService.routerLink(url)
  }

  activarHorario() { }

  activarGroupo() { }

  mostrarSubmenu(id: string) {
    if (this.submenuVisible == false) {
      this.submenuVisible = true
      this.submenuId = id
    } else {
      this.submenuVisible = false
      this.submenuId = ''
    }
  }

  async onDuplicate(uid: string) {
    const loading = await this.utilsService.loading()
    await loading.present()

    await this.firebaseService.duplicateDocument(this.path, uid)
      .finally(() => {
        this.utilsService.presentToast({
          message: `Horario duplicado correctamente`,
          duration: 1000,
          color: 'warning'
        }).finally(async () => {
          this.horarios = []
          await this.getData()
          loading.dismiss()
        })

      })
  }

  async onDelete(uid: string) {
    const loading = await this.utilsService.loading()
    await loading.present()
    this.firebaseService.deleteDocument(this.path + `/${uid}`)
      .finally(() => {
        this.utilsService.presentToast({
          message: `Horario borrado`,
          duration: 1000,
          color: 'warning'
        }).finally(() => {
          loading.dismiss()
          this.utilsService.routerLink('/home')
          this.horarios = []
          this.getData()
        })
      })
  }

}
