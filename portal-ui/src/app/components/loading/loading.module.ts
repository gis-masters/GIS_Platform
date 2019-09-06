import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { LoadingComponent } from './loading.component';

@NgModule({
  declarations: [
    LoadingComponent
  ],
  exports: [
    LoadingComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class LoadingModule { }

