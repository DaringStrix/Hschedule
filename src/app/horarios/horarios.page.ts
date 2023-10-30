import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TareaComponent } from '../components/modals/tarea/tarea.component';
import { UtilsService } from '../services/utils.service';
import { HorasComponent } from '../components/modals/horas/horas.component';
import { HorarioComponent } from '../components/modals/horario/horario.component';
import { User } from '../models/user.model';
import { FirebaseService } from '../services/firebase.service';
import { Horario } from '../models/horario.model';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {
  private navController = inject(NavController)
  private utilsService = inject(UtilsService)
  private firebaseService = inject(FirebaseService)

  public horario: string;
  public horarioActual: Horario;
  public primaryColor: string = 'primary';
  diasSemana: string[];
  colSize: number;
  path: string;

  private activatedRoute = inject(ActivatedRoute);

  constructor() { }

  user(): User {
    return this.utilsService.getFromLocalStorge('user')
  }

  gethorarioActual(): Horario {
    return this.utilsService.getFromLocalStorge('horarios').find(({ title }) => title === this.horario)
  }

  ngOnInit() {
    this.horario = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.horarioActual = this.gethorarioActual()
    this.path = `users/${this.user().uid}/horarios/${this.horarioActual.uid}`;
    this.firebaseService.getDocument(this.path).then((h: Horario) => {
      this.primaryColor = h.color
    })
    this.diasSemana = this.horarioActual.mode == 'lundom' ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    this.colSize = this.diasSemana.length == 7 ? 1.5 : 2
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
        primaryColor: this.primaryColor
      },
      cssClass: 'modal-height'
    })
  }

  addNewTarea() {
    this.utilsService.presentModal({
      component: TareaComponent,
      componentProps: {
        primaryColor: this.primaryColor
      },
      cssClass: 'modal-height'
    })
  }
}
