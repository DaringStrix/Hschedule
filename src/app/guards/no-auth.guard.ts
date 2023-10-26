import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  utilsService = inject(UtilsService);
  firebaseS = inject(FirebaseService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean {
    this.firebaseS.getAuth((user) => {
      if (user) {
        console.log('-----------------------------It isnt Autenticated-----------------------------' + JSON.stringify(user));
        this.utilsService.routerLink('/home')
        return false

      } else {
        console.log('-----------------------------Its Autenticated-----------------------------' + JSON.stringify(user));
        return true
      }
    })
    return
  }
}
