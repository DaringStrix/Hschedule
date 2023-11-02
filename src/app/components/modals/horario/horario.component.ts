import { Component, Input, OnInit, inject } from '@angular/core';
import { HorariosPage } from '../../../horarios/horarios.page';
import { UtilsService } from 'src/app/services/utils.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss'],
})
export class HorarioComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mode: new FormControl('lundom'),
    color: new FormControl('primary'),
    active: new FormControl('true'),
  })

  @Input() primaryColor!: string

  utilsService = inject(UtilsService)
  firebaseService = inject(FirebaseService)
  user = {} as User

  constructor() { }

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorge('user')
  }

  dismiss(data?: any) {
    this.utilsService.dismissModal(data)
  }
  async addHorario() {
    if (this.form.valid) {

      const loading = await this.utilsService.loading()
      await loading.present()

      let path = `users/${this.user.uid}/horarios`

      this.firebaseService.addDocument(path, this.form.value).then(async res => {

        this.dismiss({ success: true })

        this.utilsService.presentToast({
          message: `Creado nuevo horario ${this.form.controls.name.value}`,
          duration: 1000,
          color: 'success'
        })

      })
        .catch(e => {
          console.log(e);

          this.utilsService.presentToast({
            message: "Debe tener un nombre",
            duration: 1000
          })
        }).finally(()=> {
          loading.dismiss()
          window.location.reload()
        })
    }
  }
}
