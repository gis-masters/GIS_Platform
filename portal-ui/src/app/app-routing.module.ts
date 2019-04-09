import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AboutComponent} from './pages/about/about.component';
import {LoginComponent} from './pages/login/login.component';
import {MapComponent} from './pages/work-space/map/map.component';
import {LandingComponent} from './pages/landing/landing.component';
import {RegisterComponent} from './pages/register/register.component';
import {RecoveryComponent} from './pages/recovery/recovery.component';
import {WorkspaceComponent} from './pages/work-space/workspace/workspace.component';
import {DataImportComponent} from './pages/work-space/data-import/data-import.component';
import {DataMappingComponent} from './pages/work-space/data-mapping/data-mapping.component';
import {ProjectComponent} from './pages/work-space/project/project.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'recovery', component: RecoveryComponent},
  {path: 'about', component: AboutComponent},
  {
    path: 'workspace',
    component: WorkspaceComponent,
    children: [
      {path: '', redirectTo: 'map', pathMatch: 'full'},
      {path: 'projects', component: ProjectComponent},
      {path: 'map', component: MapComponent},
      {path: 'data_import', component: DataImportComponent},
      {path: 'data_mapping', component: DataMappingComponent},
      {path: '**', redirectTo: 'map'},
    ],
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

export const routingComponents = [
  MapComponent,
  LoginComponent,
  AboutComponent,
  LandingComponent,
  RegisterComponent,
  RecoveryComponent,
  WorkspaceComponent,
  DataImportComponent,
  DataMappingComponent,
];
