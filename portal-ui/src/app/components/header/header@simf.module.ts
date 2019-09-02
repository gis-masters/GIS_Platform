import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

import { HeaderComponent } from './header@simf.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  entryComponents: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class HeaderModule {
  static rootEntry = HeaderComponent;
}
