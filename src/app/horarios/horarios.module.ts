import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosPageRoutingModule } from './horarios-routing.module';

import { HorariosPage } from './horarios.page';
import { HorarioComponent } from '../modals/horario/horario.component';
import { HorasComponent } from '../modals/horas/horas.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorariosPageRoutingModule
  ],
  declarations: [HorariosPage , HorarioComponent, HorasComponent]
})
export class HorariosPageModule {}
