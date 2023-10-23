import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TareaComponent } from '../modals/tarea/tarea.component';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {
  public horario!: string;
  public primaryColor: string = 'primary';
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  private activatedRoute = inject(ActivatedRoute);
  
  
  constructor(private navController: NavController, private modalCtrl: ModalController) { }

  async abrirTarea() {
    const modal = await this.modalCtrl.create({
      component: TareaComponent,
      componentProps: {
        primaryColor: this.primaryColor
      }
    });
    modal.present();
  }
  
  ngOnInit() {
    this.horario = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
  
  changeColor(color: string) {
    this.primaryColor = color
  }
  
  addRow() {
  }
  
  abrirHerramientas() {
    this.navController.navigateForward('/herramientas')
  }

  addHorario() {
  }
  
  addTarea(){

  }
}
