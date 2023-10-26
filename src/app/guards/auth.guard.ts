import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  utilsService = inject(UtilsService);

  firebaseService = inject(FirebaseService)
  router = inject(Router)

  canActivate(): Promise<boolean> | boolean{
    let localuser = localStorage.getItem('user')

    this.firebaseService.getAuth((user) => {
      if (user) {
        if (localuser) {
          console.log('-----------------------------Its Autenticated-----------------------------');
          return true;
        }
        
      } else {
        console.log('-----------------------------It isnt Autenticated-----------------------------');
        this.utilsService.routerLink('/login')
        return false
      }
    })
    return 
  }
}
