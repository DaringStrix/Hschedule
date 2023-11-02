import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.]).{8,}")]),
  })

  public type: string = 'password'

  private utilService = inject(UtilsService)

  firebaseSvc = inject(FirebaseService)

  ngOnInit() {
  }

  async iniciarSesion() {
    if (this.form.invalid == false) {
      const loading = await this.utilService.loading()
      await loading.present()
      this.firebaseSvc.signIn(this.form.value as User).then(async res => {
        this.getUserInfo(res.user.uid)
      })
        .catch(e => {
          console.log(e);

          this.utilService.presentToast({
            message: "Usuario o contraseña incorrectos",
            duration: 1000
          })
        }).finally(() => {
          loading.dismiss()
        })
    }
  }

  validate() {
    if (this.form.controls.email.errors && this.form.controls.email.touched || this.form.controls.password.errors && this.form.controls.password.touched) {
      return true
    } else {
      return false
    }
  }
  async getUserInfo(uid: string) {
    if (this.form.invalid == false) {

      let path = `users/${uid}`
      const loading = await this.utilService.loading()
      await loading.present()
      let theUser: User
      this.firebaseSvc.getDocument(path).then((user: User) => {
        this.utilService.saveInLocalStorge('user', user)
        this.form.reset()
        theUser = user
      })
        .catch(e => {
          this.utilService.presentToast({
            message: "Usuario o contraseña incorrectos",
            duration: 1000
          })
        }).finally(() => {

          this.utilService.presentToast({
            message: `Entrando como ${theUser.email}`,
            duration: 1000
          })
          window.location.reload()
          loading.dismiss()

        })
    }
  }

  resetPasswd() {
    this.utilService.routerLink('/reset-password')

  }
}
