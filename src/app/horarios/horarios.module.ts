import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosPageRoutingModule } from './horarios-routing.module';

import { HorariosPage } from './horarios.page';
import { HorarioComponent } from '../components/horario/horario.component';
import { HorasComponent } from '../components/horas/horas.component';
import { TareaComponent } from '../components/tarea/tarea.component';
import { HeaderComponent } from '../components/header/header.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorariosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HorariosPage]
})
export class HorariosPageModule {}
