import { Component, Input, OnInit } from '@angular/core';
import { HorariosPage } from '../../horarios/horarios.page';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss'],
})
export class HorarioComponent  implements OnInit {

  @Input() primaryColor!: string
  @Input() addHorario(){}


  constructor() { }
  ngOnInit() {}


}
