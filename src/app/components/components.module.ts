import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HorarioComponent } from './modals/horario/horario.component';
import { HorasComponent } from './modals/horas/horas.component';
import { TareaComponent } from './modals/tarea/tarea.component';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from './logo/logo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GrupoComponent } from './modals/grupo/grupo.component';



@NgModule({
  declarations: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent, LogoComponent, GrupoComponent],
  exports: [HeaderComponent, HorarioComponent, HorasComponent, TareaComponent, LogoComponent, GrupoComponent],
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule
  ]
})
export class ComponentsModule { }
