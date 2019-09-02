import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

import { HomeComponent } from './home@conv.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  entryComponents: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
})
export class HomeModule {
  static rootEntry = HomeComponent;
}
