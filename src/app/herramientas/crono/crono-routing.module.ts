import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CronoPage } from './crono.page';

const routes: Routes = [
  {
    path: '',
    component: CronoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CronoPageRoutingModule {}
