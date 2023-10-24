import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HorarioComponent } from './horario/horario.component';
import { HorasComponent } from './horas/horas.component';
import { TareaComponent } from './tarea/tarea.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent],
  exports: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent],
  imports: [
    CommonModule, IonicModule
  ]
})
export class ComponentsModule { }
