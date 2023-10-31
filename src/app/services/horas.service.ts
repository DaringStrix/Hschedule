import { Injectable, inject } from '@angular/core';
import { Horas } from '../models/horas.model';
import { User } from 'firebase/auth';
import { Horario } from '../models/horario.model';
import { FirebaseService } from './firebase.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class HorasService {

  public horas: Horas[] = [];
  constructor() { }

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  user(): User {
    return this.utilsService.getFromLocalStorge('user');
  }

  async getHoras(path): Promise<Horas[]> {
    this.horas = []

    path = path + '/horas'
    const loading = await this.utilsService.loading();

    await loading.present();
    const querySnapshot = this.firebaseService.getDocs(path);

    if (!(await querySnapshot).empty) {
      (await querySnapshot).forEach((doc) => {
        const elemnt: Horas =
        {
          uid: doc.id,
          horainicio: doc.data()['horainicio'],
          horafin: doc.data()['horafin']
        }

        this.horas.push(elemnt)
      });
      this.utilsService.saveInLocalStorge('horas', this.horas)
      
      loading.dismiss()
      return this.horas
      
    } else {
      this.utilsService.unsaveInLocalStorge('horas')
      loading.dismiss()
      return this.horas
    }
  }
}
