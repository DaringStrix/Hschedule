import { FirebaseService } from './services/firebase.service';
import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { HorariosService } from './services/horarios.service';
import { Horario } from './models/horario.model';
import { User } from './models/user.model';
import { Grupo } from './models/grupo.model';
import { GrupoComponent } from './components/modals/grupo/grupo.component';
import { GruposService } from './services/grupos.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { HorarioComponent } from './components/modals/horario/horario.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {

  private firebaseService = inject(FirebaseService);
  private utilsService = inject(UtilsService);
  private horariosService = inject(HorariosService);
  private gruposService = inject(GruposService);
  private alertController = inject(AlertController)

  public horarios: Horario[] = [];
  public grupos: Grupo[] = [];
  public cuenta!: string;
  public submenuId: string[] = []
  private path = ''


  constructor() { }

  async ngOnInit() {
    await LocalNotifications.requestPermissions()
    if((await LocalNotifications.checkPermissions()).display != 'granted'){
      const alert = await this.alertController.create({
        header: 'Debe activar notificaciones',
        message: 'Sin permiso de notificacones no podrá recivir alertas de inicio de tarea',
        buttons: ['OK'],
      });
      await alert.present();
    }
    
    if (this.user()) {
      this.path = `users/${this.user().uid}`;
    }
    
    await this.getData();
    
    this.grupos.forEach(g => {
      if (g.active) {
        this.horarioWeekChanger(g).then(async () => {
          this.horarios = []
          await this.getHorarios()
        })
      }
    })
  }

  user(): User {
    return this.utilsService.getFromLocalStorge('user');
  }


  private async getData() {
    await this.getCuenta();
    await this.getHorarios();
    await this.getGrupos();
  }

  private async getCuenta() {
    if (localStorage.getItem('user')) {
      this.cuenta = await JSON.parse(localStorage.getItem('user')).email;
    }
  }
  private async getHorarios() {
    if (this.horarios.length == 0) {
      await this.horariosService.getHorarios(this.path + '/horarios').then(res => { this.horarios = res; });
    }
  }
  private async getGrupos() {
    if (this.grupos.length == 0) {
      await this.gruposService.getGrupos(this.path + '/grupos').then(res => { this.grupos = res; });
    }
  }

  async cerrarSesion() {
    const loading = await this.utilsService.loading()
    await loading.present()

    this.utilsService.clearLocalStorge()
    await this.firebaseService.singOut().then(() => {
    this.utilsService.routerLink('/home').then(()=> {
      window.location.reload()
    });
      loading.dismiss()
      this.utilsService.presentToast({
        message: `Se ha cerrado la sesión`,
        duration: 1000,
        color: 'warning'
      })
    })
  }

  redirect(url: string) {
    this.utilsService.routerLink(url)
  }

  async activarHorario(uid: string) {
    let path = this.path + `/horarios/${uid}`
    let data = await this.firebaseService.getDocument(path)
    this.firebaseService.updateDoc(path, { active: !data['active'] })
  }

  async activarGroupo(uid: string) {
    let path = this.path + `/grupos/${uid}`
    let data = await this.firebaseService.getDocument(path)
    this.firebaseService.updateDoc(path, { active: !data['active'] })
  }

  mostrarSubmenu(uid: string) {
    if (this.submenuId.find(id => id == uid)) {
      this.submenuId.splice(this.submenuId.indexOf(uid), 1)
      delete this.submenuId['uid']
    } else {
      this.submenuId.push(uid)
    }

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
        }).finally(async () => {
          this.horarios = []
          await this.getHorarios()
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
        }).finally(() => {
          loading.dismiss()
          if (window.location.pathname == `/horarios/${uid}`) {
            this.utilsService.routerLink('/home')
          }
          this.horarios = []
          this.getHorarios()
        })
      })
  }

  async deleteGrupo(uid: string) {
    const loading = await this.utilsService.loading()
    await loading.present()
    this.firebaseService.deleteDocument(this.path + `/grupos/${uid}`)
      .finally(() => {
        this.utilsService.presentToast({
          message: `Grupo borrado`,
          duration: 1000,
          color: 'warning'
        }).finally(() => {
          loading.dismiss()
          if (window.location.pathname == `/grupos/${uid}`) {
            this.utilsService.routerLink('/home')
          }
          this.grupos = []
          this.getGrupos()
        })
      })
  }

  

  async horarioWeekChanger(grupoActual: Grupo) {
    let horariosSeleccionados: any[] = []
    await this.gruposService.getHorariosOnGrupo(this.path + `/grupos/${grupoActual.uid}/horariosOnGrupo`).then(res => { horariosSeleccionados = res });

    let date = new Date()
    let domingo = new Date()
    let semanasDifer
    domingo.setTime(grupoActual.lastDayOfWeek['seconds'] * 1000)

    date.setHours(0, 0, 0, 0)
    domingo.setHours(0, 0, 0, 0)

    if (date.getTime() > domingo.getTime()) {
      semanasDifer = Math.ceil(((((date.getTime() - domingo.getTime()) / 1000) / 3600) / 24) / 7)
    } else if (date.getTime() <= domingo.getTime()) {
      semanasDifer = 0
    }

    let resto: number

    if (semanasDifer > horariosSeleccionados.length) {
      resto = semanasDifer % horariosSeleccionados.length
    } else resto = semanasDifer
    let horario
    horariosSeleccionados.forEach(hs => {
      if (hs.position == resto) {
        if (hs.active == false) {
          this.firebaseService.updateDoc(this.path + `/grupos/${grupoActual.uid}/horariosOnGrupo/${hs.uid}`, { active: true })
        }
        horario = this.horarios.find(h => h.uid == hs.uid)
        if (!horario.active) {
          this.firebaseService.updateDoc(this.path + `/horarios/${hs.uid}`, { active: true })
        }
      } else {
        if (hs.active == true) {
          this.firebaseService.updateDoc(this.path + `/grupos/${grupoActual.uid}/horariosOnGrupo/${hs.uid}`, { active: false })
        }
        horario = this.horarios.find(h => h.uid == hs.uid)
        if (horario.active) {
          this.firebaseService.updateDoc(this.path + `/horarios/${hs.uid}`, { active: false })
        }
      }
    })
  }
  
  addHorario() {
    if (this.user()) {
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
  
  addGrupo() {
    if (this.user()) {
      this.utilsService.presentModal({
        component: GrupoComponent,
        cssClass: 'modal-height'
      })
    } else {
      this.utilsService.routerLink('login')
    }
  }
}