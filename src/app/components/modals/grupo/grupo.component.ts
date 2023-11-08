import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss'],
})
export class GrupoComponent  implements OnInit {
  private date = new Date()
  private domingo = new Date()
  
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    active: new FormControl(false),
    lastDayOfWeek: new FormControl(this.domingo)
  })

  utilsService = inject(UtilsService)
  firebaseService = inject(FirebaseService)
  user = {} as User

  constructor() { }

  ngOnInit() {
    this.domingo.setDate(this.date.getDate() + (7 - this.date.getDay()))

    this.user = this.utilsService.getFromLocalStorge('user')
  }

  dismiss(data?: any) {
    this.utilsService.dismissModal(data)
  }
  async addGrupo() {
    if (this.form.valid) {

      const loading = await this.utilsService.loading()
      await loading.present()

      let path = `users/${this.user.uid}/grupos`

      this.firebaseService.addDocument(path, this.form.value).then(async res => {

        this.dismiss({ success: true })

        this.utilsService.presentToast({
          message: `Creado nuevo grupo ${this.form.controls.title.value}`,
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
