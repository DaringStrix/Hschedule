import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.]).{8,}")]),
  })

  public type: string = 'password'

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  iniciarSesion() {
    if (this.form.invalid == false) {
      this.navController.navigateForward('/horarios/horario 1')
    }
  }

  validate() {
    if (this.form.controls.user.errors && this.form.controls.user.touched || this.form.controls.password.errors && this.form.controls.password.touched) {
      return true
    } else {
      return false
    }
  }

}
