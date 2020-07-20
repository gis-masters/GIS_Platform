import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CrgSearchComponent } from './search.component';

@NgModule({
  declarations: [
    CrgSearchComponent
  ],
  exports: [
    CrgSearchComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SearchModule { }
