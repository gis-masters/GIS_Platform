import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpTogglerComponent } from './help-toggler.component';

@NgModule({
  declarations: [
    HelpTogglerComponent
  ],
  exports: [
    HelpTogglerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HelpTogglerModule { }
