import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utsv = inject(UtilsService)
  firebaseService = inject(FirebaseService);

  cerrarSesion() {
    this.utsv.unsaveInLocalStorge('user')
    this.firebaseService.singOut()
    this.utsv.routerLink('/login')
  }
  
  constructor() { }

  ngOnInit() {
  }

}
