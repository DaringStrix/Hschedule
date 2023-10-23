import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-crono',
  templateUrl: './crono.page.html',
  styleUrls: ['./crono.page.scss'],
})
export class CronoPage implements OnInit, OnDestroy {

  private stopwatch!: Subscription;
  public started = false;
  public paused = false;

  public horas: number = 0;
  public minutos: number = 0;
  public segundos: number = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.pause();
  }

  play() {
    this.started = true
    this.stopwatch = interval(1000).subscribe(() => {
      this.segundos++
      if (this.segundos == 60) {
        this.segundos = 0
        this.minutos++
        if (this.minutos == 60) {
          this.minutos = 0
          this.horas++
        }
      }
    });
  }

  pause() {
    this.started = false
    if (this.stopwatch) {
      this.stopwatch.unsubscribe();
    }
  }

  reset() {
    this.started = false
    this.pause()
    
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
  }

  formatElapsedTime() {
    return `${this.horas < 10 ? '0' + this.horas : '' + this.horas}:${this.minutos < 10 ? '0' + this.minutos : '' + this.minutos}:${this.segundos < 10 ? '0' + this.segundos : '' + this.segundos}`;
  }
}
