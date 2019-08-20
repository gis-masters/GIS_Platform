import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {AboutComponent} from './pages/about/about.component';
import {AuthGuardService} from './services/auth-guard.service';
import {MapComponent} from './pages/work-space/map/map.component';
import {LandingComponent} from './pages/landing/landing.component';
import {RegisterComponent} from './pages/register/register.component';
import {RecoveryComponent} from './pages/recovery/recovery.component';
import {WorkflowGuardService} from './services/workflow-guard.service';
import {ProjectComponent} from './pages/work-space/project/project.component';
import {WorkspaceComponent} from './pages/work-space/workspace/workspace.component';
import {DataImportPageComponent} from './pages/work-space/data-import-page/data-import-page.component';
import {DataMappingComponent} from './pages/work-space/data-mapping/data-mapping.component';

import {OrganizationInfoResolver} from './services/resolvers/project-resolver.service';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'recovery', component: RecoveryComponent},
  {path: 'about', component: AboutComponent},
  {
    path: 'workspace',
    component: WorkspaceComponent,
    resolve: {
      orgInfo: OrganizationInfoResolver
    },
    children: [
      {path: '', redirectTo: 'projects', pathMatch: 'full'},
      {path: 'projects', component: ProjectComponent},
      {path: 'data_import', component: DataImportPageComponent, canActivate: [WorkflowGuardService]},
      {path: 'data_mapping', component: DataMappingComponent},
      {path: 'map', component: MapComponent, canActivate: [WorkflowGuardService]},
      {path: '**', redirectTo: 'map'},
    ],
    canActivate: [AuthGuardService]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, WorkflowGuardService]
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
  DataImportPageComponent,
  DataMappingComponent,
];
