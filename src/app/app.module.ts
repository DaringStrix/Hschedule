import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from "./components/components.module";

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

import { initializeApp } from 'firebase/app';

initializeApp(environment.firebaseConfig)


@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ComponentsModule,AngularFireModule.initializeApp(environment.firebaseConfig)],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule { }
