import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent  implements OnInit {

  @Input() primaryColor!: string
  @Input() addTarea(){}

  public icono: string = 'earth'
  
  constructor() { }

  ngOnInit() {}

  abrirTarea(){}

  option($event: any){
    this.icono = $event.detail.value
  }

}
