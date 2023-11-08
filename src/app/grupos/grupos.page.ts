import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { Grupo } from '../models/grupo.model';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../models/user.model';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Horario } from '../models/horario.model';
import { HorariosService } from '../services/horarios.service';
import { GruposService } from '../services/grupos.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {

  private utilsService = inject(UtilsService)
  private firebaseService = inject(FirebaseService)
  private activatedRoute = inject(ActivatedRoute);
  private horariosService = inject(HorariosService);
  private gruposService = inject(GruposService);

  public idGrupo = this.activatedRoute.snapshot.paramMap.get('id');
  public grupoActual: Grupo = {
    uid: '0',
    title: 'grupoEjemplo',
    active: false,
    lastDayOfWeek: new Date(),
    url: '/grupos/grupoEjemplo'
  };
  public path: string
  public horarios: Horario[] = [];
  public horariosSeleccionados: any[] = [];
  public horariosChecked: any[] = [];

  constructor() { }

  async ngOnInit() {
    this.path = `users/${this.user().uid}`;

    this.horariosSeleccionados = [];

    await this.getData()

  }


  private user(): User {
    return this.utilsService.getFromLocalStorge('user')
  }

  private async getData() {
    await this.firebaseService.getDocument(this.path + `/grupos/${this.idGrupo}`).then(g => {
      this.grupoActual.uid = this.idGrupo;
      this.grupoActual.title = g['title'];
      this.grupoActual.active = g['active'];
      this.grupoActual.lastDayOfWeek = g['lastDayOfWeek'];
      this.grupoActual.url = `/grupos/${this.idGrupo}`;
    }).catch(e => {
      this.utilsService.routerLink('/home');
    });

    if (this.horariosSeleccionados.length == 0) {
      await this.gruposService.getHorariosOnGrupo(this.path + `/grupos/${this.idGrupo}/horariosOnGrupo`).then(res => { this.horariosSeleccionados = res });
    }

    if (this.horarios.length == 0) {
      await this.horariosService.getHorarios(this.path + '/horarios').then(res => { this.horarios = res });
    }

    this.horariosSeleccionados.sort((a, b) => a.position - b.position)
    this.horariosChecked = this.horariosSeleccionados

  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    this.horariosSeleccionados = ev.detail.complete(this.horariosSeleccionados);

    this.firebaseService.updateDoc(this.path + `/grupos/${this.idGrupo}/horariosOnGrupo/${this.horariosSeleccionados[ev.detail.from].uid}`, { position: ev.detail.to })
    this.horariosSeleccionados.forEach(h => {
      this.firebaseService.setDocument(this.path + `/grupos/${this.idGrupo}/horariosOnGrupo/${h.uid}`, {
        title: h.title,
        active: h.active,
        position: this.horariosSeleccionados.indexOf(h)
      })
    })

  }

  addHorario() {
    this.horariosSeleccionados = this.horariosChecked
    this.horariosSeleccionados.forEach(h => {
      this.firebaseService.setDocument(this.path + `/grupos/${this.idGrupo}/horariosOnGrupo/${h.uid}`, {
        title: h.title,
        active: h.active,
        position: this.horariosSeleccionados.indexOf(h)
      })
    })
    this.dismissModal()
  }

  checkboxChanged(uid: string) {
    if (this.horariosChecked.find(hc => hc.uid == uid)) {
      this.horariosChecked.splice(this.horariosChecked.indexOf(this.horariosChecked.find(hc => hc.uid == uid)), 1)
    } else {
      this.horariosChecked.push(this.horarios.find(h => h.uid == uid))
    }

  }

  dismissModal(data?: any) {
    this.utilsService.dismissModal(data)
  }

  isChecked(uid: string): boolean {
    return this.horariosChecked.find(h => uid == h.uid) != -1
  }
}
