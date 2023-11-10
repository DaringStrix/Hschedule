import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { UtilsService } from './utils.service';
import { User } from '../models/user.model';
import { Horario } from '../models/horario.model';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  public horarios: Horario[] = [];
  constructor() { }

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);


  async getHorarios(path): Promise<Horario[]> {
    if (path) {
      this.horarios = []
      const loading = await this.utilsService.loading();

      await loading.present();
      const querySnapshot = this.firebaseService.getDocs(path);

      (await querySnapshot).forEach((doc) => {
        const elemnt: Horario =
        {
          uid: doc.id,
          title: doc.data()['title'],
          active: doc.data()['active'],
          mode: doc.data()['mode'],
          color: doc.data()['color'],
          url: `/horarios/${doc.id}`
        }

        this.horarios.push(elemnt)
      });

      this.utilsService.unsaveInLocalStorge('horarios')
      this.utilsService.saveInLocalStorge('horarios', this.horarios)

      loading.dismiss()

      return this.horarios
    }

  }

  getHorariosGuardados() {
    return this.horarios
  }

  getColor(searchtitle: string) {
    const arrayH = this.utilsService.getFromLocalStorge('horarios')
    return arrayH.find(({ title }) => title === searchtitle).color
  }

}
