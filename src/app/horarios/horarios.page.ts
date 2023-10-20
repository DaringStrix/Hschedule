import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  
  
  constructor() { }
  
  ngOnInit() {
    this.horario = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
  
  changeColor(color: string) {
    this.primaryColor = color
  }
  
  addRow() {
  }
  
  abrirHerramientas() {
  }

  addHorario() {
  }
}
