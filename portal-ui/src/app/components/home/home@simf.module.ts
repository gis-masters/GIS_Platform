import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

import { LoginFormModule } from '../login-form/login-form.module';

import { HomeComponent } from './home@simf.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  entryComponents: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoginFormModule
  ],
})
export class HomeModule {
  static rootEntry = HomeComponent;
}
