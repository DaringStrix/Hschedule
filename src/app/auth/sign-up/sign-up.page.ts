import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {


  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.]).{8,}")]),
    reppassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.]).{8,}")]),
  })

  type = 'password'

  constructor() { }

  ngOnInit() {
  }

  private utilService = inject(UtilsService)
  firebaseSvc = inject(FirebaseService)



  registrarSesion() {
    if (this.form.invalid == false) {
      this.firebaseSvc.signUp(this.form.value as User).then(res => { 
        let uid = res.user.uid
        this.form.controls.uid.setValue(uid)
        this.setUserInfo(uid)
        
       })
        .catch(e => {

          this.utilService.presentToast({
            message: "Usuario o contraseña incorrectos",
            duration: 1000
          })
        })
    }

  }
  async setUserInfo(uid: string) {
    if (this.form.invalid == false) {

      let path = `users/${uid}`
      delete this.form.value.password 
      delete this.form.value.reppassword

      this.firebaseSvc.setDocument(path, this.form.value).then( async res => {
        this.utilService.saveInLocalStorge('user', this.form.value)
        this.form.reset()
        })
        .catch(e => {
          this.utilService.presentToast({
            message: "Usuario o contraseña incorrectos",
            duration: 1000
          })
        })
    }
  }

  viewPasswd() {
    this.type == 'password' ? this.type = 'text' : this.type = 'password'
  }


  validate() {

    if (this.form.controls.email.errors && this.form.controls.email.touched || this.form.controls.password.errors && this.form.controls.password.touched || this.form.controls.password.value != this.form.controls.reppassword.value) {
      return true
    } else {
      return false
    }
  }

}
