import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-horas',
  templateUrl: './horas.component.html',
  styleUrls: ['./horas.component.scss'],
})
export class HorasComponent implements OnInit {

  @Input() primaryColor!: string
  @Input() addRow() { }

  utilsService = inject(UtilsService)

  constructor() { }

  ngOnInit() { }

  dismiss() {
    this.utilsService.dismissModal()
  }
}
