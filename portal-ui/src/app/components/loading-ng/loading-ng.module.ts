import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { LoadingNgComponent } from './loading-ng.component';

@NgModule({
  declarations: [LoadingNgComponent],
  exports: [LoadingNgComponent],
  imports: [MaterialModule, CommonModule]
})
export class LoadingNgModule {}
