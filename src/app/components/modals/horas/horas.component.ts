import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-horas',
  templateUrl: './horas.component.html',
  styleUrls: ['./horas.component.scss'],
})
export class HorasComponent implements OnInit {

  form = new FormGroup({
    horainicio: new FormControl('00:00', [Validators.required]),
    horafin: new FormControl('00:10', [Validators.required]),
  })

  @Input() primaryColor!: string
  @Input() path!: string

  utilsService = inject(UtilsService)
  firebaseService = inject(FirebaseService)

  public pCHoraInicio = [{
    name: 'horas',
    options: Array.from({ length: 24 }, (_, i) => ({ text: i < 10 ? `0${i}` : `${i}`, value: i })),
  }, {
    name: 'minutos',
    options: Array.from({ length: 60 }, (_, i) => ({ text: i < 10 ? `0${i}` : `${i}`, value: i })),
  }];

  public pBHoraInicio = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      handler: (value) => this.handler(this.form.controls.horainicio, value),
    },
  ];

  public pCHoraFin = [{
    name: 'horas',
    options: Array.from({ length: 24 }, (_, i) => ({ text: i < 10 ? `0${i}` : `${i}` })),
  }, {
    name: 'minutos',
    options: Array.from({ length: 60 }, (_, i) => ({ text: i < 10 ? `0${i}` : `${i}` })),
  }];

  public pBHoraFin = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      handler: (value) => this.handler(this.form.controls.horafin, value),
    },
  ];

  constructor() { }

  ngOnInit() { }

  dismiss(data?: any) {
    this.utilsService.dismissModal(data)
  }
  async addHora() {
    if (this.form.valid && this.validateTime()) {

      const loading = await this.utilsService.loading()
      await loading.present()

      this.path = this.path + '/horas'

      this.firebaseService.addDocument(this.path, this.form.value).then(async res => {

        this.dismiss({ success: true })

        this.utilsService.presentToast({
          message: `Creado nueva franja horaria ${this.form.controls.horainicio.value}/${this.form.controls.horafin.value}`,
          duration: 1000,
          color: 'success'
        })

      })
        .catch(e => {
          console.log(e);

          this.utilsService.presentToast({
            message: "Debe tener ambas horas",
            duration: 1000
          })
        }).finally(() => {
          window.location.reload()
          loading.dismiss()
        })
    }
  }

  validateTime(): boolean {
    if (this.form.controls.horafin.value.split(':') < this.form.controls.horainicio.value.split(':')) {
      return false;
    } else {
      return true;
    }
  }

  handler(control: FormControl<string>, value: any) {
    control.setValue(value.horas.text + ':' + value.minutos.text)
  }
}
