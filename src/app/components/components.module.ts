import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HorarioComponent } from './horario/horario.component';
import { HorasComponent } from './horas/horas.component';
import { TareaComponent } from './tarea/tarea.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from './logo/logo.component';



@NgModule({
  declarations: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent, LogoComponent],
  exports: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent, LogoComponent],
  imports: [
    CommonModule, IonicModule
  ]
})
export class ComponentsModule { }
