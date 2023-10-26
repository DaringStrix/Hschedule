import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private toastController = inject(ToastController)
  private router = inject(Router)


  constructor() { }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    console.log('Redirecting to: '+ url);
    
    return this.router.navigateByUrl(url)
  }
  
  saveInLocalStorge(key: string, value: any) {
    let valor = JSON.stringify(value)
    
    return localStorage.setItem(key, valor)
  }
  getFromLocalStorge(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }
  unsaveInLocalStorge(key: string) {
    return localStorage.removeItem(key)
  }

}
