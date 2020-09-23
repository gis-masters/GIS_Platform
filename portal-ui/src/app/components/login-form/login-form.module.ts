import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { LoadingModule } from '../loading/loading.module';
import { LoginFormComponent } from './login-form.component';

@NgModule({
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, CommonModule, RouterModule, LoadingModule]
})
export class LoginFormModule {}
