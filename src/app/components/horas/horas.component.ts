import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-horas',
  templateUrl: './horas.component.html',
  styleUrls: ['./horas.component.scss'],
})
export class HorasComponent  implements OnInit {

  @Input() primaryColor!: string
  @Input() addRow(){}


  constructor() { }

  ngOnInit() {}

}
