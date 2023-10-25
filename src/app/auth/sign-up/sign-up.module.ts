import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';

import { SignUpPage } from './sign-up.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [SignUpPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SignUpPageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ]
})
export class SignUpPageModule {}
