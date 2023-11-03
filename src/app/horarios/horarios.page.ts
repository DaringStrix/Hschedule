import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TareaComponent } from '../components/modals/tarea/tarea.component';
import { UtilsService } from '../services/utils.service';
import { HorasComponent } from '../components/modals/horas/horas.component';
import { User } from '../models/user.model';
import { FirebaseService } from '../services/firebase.service';
import { Horas } from '../models/horas.model';
import { HorasService } from '../services/horas.service';
import { TareasService } from '../services/tareas.service';
import { Tarea } from '../models/tarea.model';
import { Horario } from '../models/horario.model';
import { HorarioComponent } from '../components/modals/horario/horario.component';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  private navController = inject(NavController)
  private utilsService = inject(UtilsService)
  private firebaseService = inject(FirebaseService)
  private horasService = inject(HorasService)
  private tareasService = inject(TareasService)
  private activatedRoute = inject(ActivatedRoute);

  public idHorario: string;
  public horarioActual: Horario = {
    uid: '0',
    title: 'horarioEjemplo',
    active: false,
    mode: 'lundom',
    color: 'primary',
    url: '/horarios/horarioEjemplo'
  };
  public franjasHorarias: Horas[] = [];
  public tareas: Tarea[] = [];
  public primaryColor: string = 'primary';
  public diasSemana: string[];
  public colSize: number;
  public path: string;
  public tabla: any[][] = []
  public franjaActual = []

  constructor() { }

  async ngOnInit() {
    this.idHorario = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.path = `users/${this.user().uid}/horarios/${this.idHorario}`;

    await this.firebaseService.getDocument(this.path).then(h => {
      this.primaryColor = h['color'];
      this.horarioActual.uid = this.idHorario
      this.horarioActual.title = h['name']
      this.horarioActual.active = h['active']
      this.horarioActual.mode = h['mode']
      this.horarioActual.color = h['color']
      this.horarioActual.url = `/horarios/${this.idHorario}`
    }).catch(e => {
      this.utilsService.routerLink('/home')
    })

    this.diasSemana = this.horarioActual.mode == 'lundom' ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    this.colSize = this.diasSemana.length == 7 ? 1.55 : 2.2

    await this.getHoras();
    await this.getTareas();
    this.crearTabla();

  }

  private crearTabla() {
    let horas = []
    this.franjasHorarias.forEach(hora => {
      horas.push({
        horaInicio: hora.horainicio,
        horaFin: hora.horafin
      })
    });
    this.diasSemana.forEach(dia => {
      this.tabla.push([dia, horas]);
    });
  }

  private user(): User {
    return this.utilsService.getFromLocalStorge('user')
  }

  private async getHoras() {
    await this.horasService.getHoras(this.path).then(res => { this.franjasHorarias = res; });

    this.franjasHorarias.sort((a, b) => {
      return a.horafin.localeCompare(b.horainicio);
    });
  }


  private async getTareas() {

    let franjas = []
    let tasks: Promise<Tarea[]>
    await this.franjasHorarias.forEach(franja => { franjas.push(franja.uid) })
    franjas.forEach(uid => {
      tasks = this.tareasService.getTareas(this.path + `/horas/${uid}`).then(res => { return res })
    })
    this.tareas = await tasks

  }

  getTarea(row: number, col: number) {

    let tarea = this.tareas.find(t =>
      t.dia == this.tabla[col][0] && t.horaI == this.tabla[col][1][row].horaInicio && t.horaF == this.tabla[col][1][row].horaFin
    )

    if (tarea) {
      return tarea
    }

  }

  changeColor(color: string) {
    this.primaryColor = color
    this.firebaseService.updateDoc(this.path, { color: this.primaryColor })
  }

  abrirHerramientas() {
    this.navController.navigateForward('/herramientas')
  }

  addNewHorario() {
    this.utilsService.presentModal({
      component: HorarioComponent,
      componentProps: {
        primaryColor: this.primaryColor
      },
      cssClass: 'modal-height'
    })
  }

  addNewHora() {
    this.utilsService.presentModal({
      component: HorasComponent,
      componentProps: {
        primaryColor: this.primaryColor,
        path: this.path
      },
      cssClass: 'modal-height'
    })
  }
  log() {
    console.log('***************************************************************');

  }
  addNewTarea(idhoras: string, dia: string, row: number, col: number) {
    this.utilsService.presentModal({
      component: TareaComponent,
      componentProps: {
        primaryColor: this.primaryColor,
        path: this.path + `/horas/${idhoras}/tareas`,
        dia: dia
      },
      cssClass: 'modal-height'
    })
  }

  abrirEnlace(url: string) {
    if (url != '' && url.includes('.')) {
      window.open(url, '_blank')
    }
  }
}
