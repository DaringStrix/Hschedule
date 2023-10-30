import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent implements OnInit {

  @Input() primaryColor!: string
  @Input() addTarea() { }

  public icono: string = 'earth'

  utilsService = inject(UtilsService)
  constructor() { }

  ngOnInit() { }

  abrirTarea() { }

  option($event: any) {
    this.icono = $event.detail.value
  }
  dismiss() {
    this.utilsService.dismissModal()
  }
}
