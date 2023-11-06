import { Injectable, inject } from '@angular/core';
import { Tarea } from '../models/tarea.model';
import { FirebaseService } from './firebase.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  public tareas: Tarea[] = [];
  constructor() { }

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  async getTareas(path): Promise<Tarea[]> {
    this.tareas = []
    let horaI: string
    let horaF: string
    this.firebaseService.getDocument(path).then(res => {
      horaI = res['horainicio']
      horaF = res['horafin']
    })

    path = path + '/tareas'

    const querySnapshot = this.firebaseService.getDocs(path);
    
    if (!(await querySnapshot).empty) {
      (await querySnapshot).forEach((doc) => {
        const elemnt: Tarea =
        {
          uid: doc.id,
          title: doc.data()['title'],
          description: doc.data()['description'],
          enlace: doc.data()['enlace'] ? doc.data()['enlace'] : '',
          icono: doc.data()['icono'],
          dia: doc.data()['dia'],
          horaI: horaI,
          horaF: horaF,
          active: doc.data()['active'],
        }

        if (this.tareas.find(t => t.uid == elemnt.uid)) {
          
        }else this.tareas.push(elemnt)
      });

      this.utilsService.saveInLocalStorge('tareas', this.tareas)
      
      return this.tareas

    } else {
      this.utilsService.unsaveInLocalStorge('tareas')
      return this.tareas
    }
  }
}
