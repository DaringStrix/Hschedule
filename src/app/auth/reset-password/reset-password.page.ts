import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  public type: string = 'password'

  private utilService = inject(UtilsService)

  firebaseSvc = inject(FirebaseService)

  async recuperarPasswd() {
    if (this.form.invalid == false) {
      console.log(this.form.value as User);
      
      this.firebaseSvc.sendReoveryEmail(this.form.value.email).then(res => {
      this.utilService.routerLink('/login')

      this.utilService.presentToast({
        message: "Enviado email de recuperación",
        duration: 1500
      })


      })
        .catch(e => {
          console.log(e);
          
          this.utilService.presentToast({
            message: "Usuario o contraseña incorrectos",
            duration: 1000
          })
        })
    }
  } 

}
