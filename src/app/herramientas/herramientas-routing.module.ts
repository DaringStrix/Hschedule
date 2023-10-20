import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HerramientasPage } from './herramientas.page';

const routes: Routes = [
  {
    path: '',
    component: HerramientasPage,
    children: [
      {
        path: 'crono',
        loadChildren: () => import('./crono/crono.module').then(m => m.CronoPageModule)
      },
      {
        path: 'timer',
        loadChildren: () => import('./timer/timer.module').then(m => m.TimerPageModule)
      },
      {
        path: '',
        redirectTo: '/herramientas/crono',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HerramientasPageRoutingModule { }
