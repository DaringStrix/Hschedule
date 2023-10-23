import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnInit {

  public started = false
  public cannotPlay = true
  public finished = false

  private stopwatch!: Subscription;

  public horas: number = 0;
  public minutos: number = 0;
  public segundos: number = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.stop();
  }

  play() {
    this.started = true
    this.cannotPlay = true

    this.stopwatch = interval(1000).subscribe(() => {


      if (this.segundos > 0) {
        this.segundos--
      } else {
        if (this.minutos > 0) {
          this.segundos = 59
          this.minutos--
        } else {
          if (this.horas > 0) {
            this.segundos = 59
            this.minutos = 59
            this.horas--
          }
        }
      }

      if (this.horas <= 0 && this.minutos <= 0 && this.segundos <= 0) {
        this.finished = true
        this.stop()
      }

    });
  }

  stop() {
    if (this.stopwatch) {
      this.stopwatch.unsubscribe();
    }
  }

  reset() {
    this.stop()
    this.started = false
    this.cannotPlay = true

    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
  }

  formatElapsedTime() {
    return `${this.horas < 10 ? '0' + this.horas : '' + this.horas}:${this.minutos < 10 ? '0' + this.minutos : '' + this.minutos}:${this.segundos < 10 ? '0' + this.segundos : '' + this.segundos}`;
  }

  onInputHoras($event: any) {
    this.horas = $event.detail.value ? $event.detail.value : 0
    this.cannotPlay = false
  }
  onInputMin($event: any) {
    this.minutos = $event.detail.value ? $event.detail.value : 0
    this.cannotPlay = false
  }
  onInputSeg($event: any) {
    this.segundos = $event.detail.value ? $event.detail.value : 0
    this.cannotPlay = false
  }
}
