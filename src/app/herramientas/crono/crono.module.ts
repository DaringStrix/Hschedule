import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CronoPageRoutingModule } from './crono-routing.module';

import { CronoPage } from './crono.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CronoPageRoutingModule
  ],
  declarations: [CronoPage]
})
export class CronoPageModule {}
