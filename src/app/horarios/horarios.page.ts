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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { LocalNotifications, LocalNotificationSchema, ScheduleOptions } from '@capacitor/local-notifications';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    mode: new FormControl('lundom'),
    color: new FormControl('primary'),
    active: new FormControl(true),
  })

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
  public markedColor: string = 'warning';
  public diasSemana: string[];
  public colSize: number;
  public path: string;
  public tabla: any[][] = []
  public editar = false
  public options: ScheduleOptions = {
    notifications: []
  }
  public notificaciones: LocalNotificationSchema[] = []

  constructor() { }

  async ngOnInit() {
    this.idHorario = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.path = `users/${this.user().uid}/horarios/${this.idHorario}`;

    await this.getData();

    this.diasSemana = this.horarioActual.mode == 'lundom' ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    this.colSize = this.diasSemana.length == 7 ? 1.55 : 2.2


    this.crearTabla();

    this.checkSchedule()

  }

  checkSchedule() {
    interval(5000).subscribe(() => {
      let now = new Date();
      let currentDay = now.getDay() - 1

      if (this.tareas) {
        let i = 1
        this.tareas.forEach(async tarea => {
          const tiempoI = new Date();
          const [horaI, minutosI] = tarea['horaI'].split(":");
          tiempoI.setHours(parseInt(horaI), parseInt(minutosI));
          const tiempoF = new Date();
          const [horaF, minutosF] = tarea['horaF'].split(":");
          tiempoF.setHours(parseInt(horaF), parseInt(minutosF));
          if (tarea.dia == this.tabla[currentDay][0] && tiempoI.getTime() <= now.getTime() && now.getTime() <= tiempoF.getTime()) {
            if (!tarea.active) {
              const idHora = this.franjasHorarias.find(fh => fh.horainicio == tarea.horaI && fh.horafin == tarea.horaF).uid
              if (!tarea.active) {
                let notification = {
                  id: i++,
                  title: 'Tarea iniciada',
                  body: `${tarea.title} se a iniciado a las ${tarea.horaI} y finalizará a las  ${tarea.horaF}`,
                  iconColor: '#130398'
                }

                this.notificaciones.push(notification)

                this.firebaseService.updateDoc(this.path + `/horas/${idHora}/tareas/${tarea.uid}`, { active: true })
                  .finally(() => { this.getTareas() })
              }
            }
          } else {
            if (tarea.active) {
              const idHora = this.franjasHorarias.find(fh => fh.horainicio == tarea.horaI && fh.horafin == tarea.horaF).uid
              if (tarea.active) {
                this.firebaseService.updateDoc(this.path + `/horas/${idHora}/tareas/${tarea.uid}`, { active: false })
                  .finally(() => this.getTareas())
              }

            }
          }
        })
      }

      this.options = {
        notifications: this.notificaciones
      }

      if (this.options.notifications.length != 0) {
        LocalNotifications.schedule(this.options)
        this.options = {
          notifications: []
        }
        this.notificaciones = []
      }
    })
  }

  private async getData() {
    await this.getHorario();
    await this.getHoras();
    await this.getTareas();
  }

  private async getHorario() {
    await this.firebaseService.getDocument(this.path).then(h => {
      this.primaryColor = h['color'];
      this.horarioActual.uid = this.idHorario;
      this.horarioActual.title = h['title'];
      this.horarioActual.active = h['active'];
      this.horarioActual.mode = h['mode'];
      this.horarioActual.color = h['color'];
      this.horarioActual.url = `/horarios/${this.idHorario}`;
    }).catch(e => {
      this.utilsService.routerLink('/home');
    });
  }

  private crearTabla() {
    this.tabla = []
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
    this.franjasHorarias = []
    await this.horasService.getHoras(this.path).then(res => { this.franjasHorarias = res; });

    this.franjasHorarias.sort((a, b) => {
      const horainicioA = a.horainicio;
      const horainicioB = b.horainicio;
      const horafinA = a.horafin;
      const horafinB = b.horafin;

      if (horainicioA.localeCompare(horainicioB) !== 0) {
        return horainicioA.localeCompare(horainicioB);
      }
      return horafinA.localeCompare(horafinB);
    });
  }

  private async getTareas() {
    this.tareas = []
    let franjas = []
    let tasks: Promise<Tarea[]>
    this.franjasHorarias.forEach(franja => { franjas.push(franja.uid) })
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

  addNewTarea(idhoras: string, dia: string) {
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
      window.open(url, '_system', 'location=yes')
    }
  }

  editarTitulo() {
    this.form.controls.active.setValue(this.horarioActual.active)
    this.form.controls.color.setValue(this.horarioActual.color)
    this.form.controls.mode.setValue(this.horarioActual.mode)

    if (this.form.valid) {
      this.firebaseService.updateDoc(this.path, this.form.value)
        .finally(() => {
          this.utilsService.presentToast({
            message: 'Titulo editado',
            duration: 1000,
            color: 'success'
          }).finally(() => {
            this.getData()
            this.quiereEditar()
          })
        })
    } else {
      this.utilsService.presentToast({
        message: 'Debe haber un titulo',
        duration: 1000,
        color: 'danger'
      })
    }
  }

  quiereEditar() {
    if (this.editar == false) {
      this.editar = true
    } else {
      this.form.reset()
      this.editar = false
    }
  }

  borrarTarea(idHora: string, idTarea: string) {
    this.firebaseService.deleteDocument(this.path + `/horas/${idHora}/tareas/${idTarea}`)
      .finally(() => {
        this.utilsService.presentToast({
          message: 'Tarea eliminada',
          duration: 1000,
          color: 'danger'
        }).finally(() => {
          this.getTareas();
        })
      })
  }

  borrarHoras(idHora: string) {
    this.firebaseService.deleteDocument(this.path + `/horas/${idHora}`)
      .finally(() => {
        this.utilsService.presentToast({
          message: 'Franja horaria eliminada',
          duration: 1000,
          color: 'danger'
        }).finally(async () => {
          await this.getData();
          this.crearTabla()
        })
      })
  }
}
