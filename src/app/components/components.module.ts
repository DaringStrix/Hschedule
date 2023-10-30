import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HorarioComponent } from './modals/horario/horario.component';
import { HorasComponent } from './modals/horas/horas.component';
import { TareaComponent } from './modals/tarea/tarea.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from './logo/logo.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent, LogoComponent],
  exports: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent, LogoComponent],
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule
  ]
})
export class ComponentsModule { }
