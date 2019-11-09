import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { LoadingModule } from '../loading/loading.module';

import { ProjectCardComponent } from './project-card.component';
import { ProjectCardTypeAddComponent } from './_type/project-card_type_add.component';
import { ProjectCardTypeLoadingComponent } from './_type/project-card_type_loading.component';
import { ProjectCardTypeReadyComponent } from './_type/project-card_type_ready.component';

@NgModule({
  declarations: [
    ProjectCardComponent,
    ProjectCardTypeAddComponent,
    ProjectCardTypeLoadingComponent,
    ProjectCardTypeReadyComponent
  ],
  exports: [
    ProjectCardComponent,
    ProjectCardTypeAddComponent,
    ProjectCardTypeLoadingComponent,
    ProjectCardTypeReadyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadingModule,
    RouterModule
  ]
})
export class ProjectCardModule { }
