import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent implements OnInit {
  
  @Input() primaryColor!: string
  @Input() path!: string
  @Input() dia!: string
  
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    enlace: new FormControl(''),
    icono: new FormControl('earth', [Validators.required]),
    dia: new FormControl(''),
    active: new FormControl(false)
  })
    
  utilsService = inject(UtilsService)
  firebaseService = inject(FirebaseService)
  httpClient = inject(HttpClient)

  public icons: string[] = []

  constructor() { }

  ngOnInit() { 
    this.form.controls.dia.setValue(this.dia)
    this.httpClient.get('../assets/ionicons.json').subscribe((data: { icons: string[] }) => {
      this.icons = data.icons;
    });
    
  }

  setIcon(icon: string){
    this.form.controls.icono.setValue(icon)
  }

  dismiss(data?: any) {
    this.utilsService.dismissModal(data)
  }
  
  async addTarea() {
    console.log('////////////Añadiendo');
    
    if (this.form.valid) {
      console.log('////////////Valido');

      const loading = await this.utilsService.loading()
      await loading.present()

      this.firebaseService.addDocument(this.path, this.form.value).then(async res => {

        this.dismiss({ success: true })

        this.utilsService.presentToast({
          message: `Creada nueva tarea ${this.form.controls.title.value}`,
          duration: 1000,
          color: 'success'
        }).finally(() => {
          window.location.reload()
          loading.dismiss()
        })

      })
        .catch(e => {
          console.log(e);

          this.utilsService.presentToast({
            message: "Debe tener ambas horas",
            duration: 1000
          })
        })
    }
  }
  validate() {
    if (this.form.controls.title.errors && this.form.controls.title.touched || this.form.controls.description.errors && this.form.controls.description.touched) {
      return true
    } else {
      return false
    }
  }
}
