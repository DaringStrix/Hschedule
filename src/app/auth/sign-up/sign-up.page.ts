import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.]).{8,}")]),
    reppassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.]).{8,}")]),
  })

  type = 'password'

  constructor(private navController: NavController) { }

  ngOnInit() {
  }


  registrarSesion() {
    if (this.form.invalid == false && this.form.controls.password.value == this.form.controls.reppassword.value) {
      this.navController.navigateForward('/horarios/horario 1')
    }
  }

  viewPasswd() {
    this.type == 'password' ? this.type = 'text' : this.type = 'password'
  }


  validate() {

    if (this.form.controls.user.errors && this.form.controls.user.touched || this.form.controls.password.errors && this.form.controls.password.touched || this.form.controls.password.value!=this.form.controls.reppassword.value) {
      return true
    } else {
      return false
    }
  }

}
