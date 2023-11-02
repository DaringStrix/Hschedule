import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ToastOptions, ModalController, ModalOptions, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingController = inject(LoadingController)
  private toastController = inject(ToastController)
  private modalController = inject(ModalController)
  private router = inject(Router)


  constructor() { }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    console.log('Redirecting to: ' + url);

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
  clearLocalStorge() {
    return localStorage.clear()
  }

  loading(){
    return this.loadingController.create({spinner: 'lines'})
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);

    await modal.present();

    const { data } = await modal.onWillDismiss()
    if (data) return data

  }

  dismissModal(data?: any) {
    return this.modalController.dismiss(data)
  }
}
