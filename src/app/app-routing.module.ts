import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'horarios/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./horarios/horarios.module').then(m => m.HorariosPageModule)
  },
  {
    path: 'grupos/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./grupos/grupos.module').then(m => m.GruposPageModule)
  },
  {
    path: 'herramientas',
    canActivate: [AuthGuard],
    loadChildren: () => import('./herramientas/herramientas.module').then(m => m.HerramientasPageModule)
  },
  {
    path: 'sign-up',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'reset-password',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./auth/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
