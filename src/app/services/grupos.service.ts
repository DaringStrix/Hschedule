import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { UtilsService } from './utils.service';
import { Grupo } from '../models/grupo.model';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  public grupos: Grupo[] = [];
  public  horarioOnGrupo: any[] = [];
  constructor() { }

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  async getGrupos(path): Promise<Grupo[]> {
    if (path) {
      this.grupos = []
      const loading = await this.utilsService.loading();

      await loading.present();
      const querySnapshot = this.firebaseService.getDocs(path);

      (await querySnapshot).forEach((doc) => {
        const elemnt: Grupo =
        {
          uid: doc.id,
          title: doc.data()['title'],
          active: doc.data()['active'],
          lastDayOfWeek: doc.data()['lastDayOfWeek'],
          url: `/grupos/${doc.id}`
        }

        this.grupos.push(elemnt)
      });

      this.utilsService.unsaveInLocalStorge('grupos')
      this.utilsService.saveInLocalStorge('grupos', this.grupos)

      loading.dismiss()

      return this.grupos
    }

  }
  async getHorariosOnGrupo(path): Promise<any[]> {
    if (path) {
      this.horarioOnGrupo = []
      const loading = await this.utilsService.loading();

      await loading.present();
      const querySnapshot = this.firebaseService.getDocs(path);

      (await querySnapshot).forEach((doc) => {
        const elemnt =
        {
          uid: doc.id,
          title: doc.data()['title'],
          active: doc.data()['active'],
          position: doc.data()['position']
        }

        this.horarioOnGrupo.push(elemnt)
      });

      this.utilsService.unsaveInLocalStorge('horarioOnGrupo')
      this.utilsService.saveInLocalStorge('horarioOnGrupo', this.horarioOnGrupo)

      loading.dismiss()

      return this.horarioOnGrupo
    }

  }
}
