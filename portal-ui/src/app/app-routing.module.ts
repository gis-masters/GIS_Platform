import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from './pages/login/login-page.component';
import {AboutComponent} from './pages/about/about.component';
import {AuthGuardService} from './services/auth-guard.service';
import {MapComponent} from './pages/work-space/map/map.component';
import {HomePageComponent} from './pages/home/home-page.component';
import {RegisterComponent} from './pages/register/register.component';
import {RecoveryComponent} from './pages/recovery/recovery.component';
import {WorkflowGuardService} from './services/workflow-guard.service';
import {ProjectsListPageComponent} from './pages/work-space/projects-list/projects-list-page.component';
import {WorkspaceComponent} from './pages/work-space/workspace/workspace.component';
import {DataImportPageComponent} from './pages/work-space/data-import-page/data-import-page.component';
import {DataMappingComponent} from './pages/work-space/data-mapping/data-mapping.component';

import {OrganizationInfoResolver} from './services/resolvers/project-resolver.service';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
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
      {path: 'projects', component: ProjectsListPageComponent},
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
  LoginPageComponent,
  AboutComponent,
  HomePageComponent,
  RegisterComponent,
  RecoveryComponent,
  WorkspaceComponent,
  DataImportPageComponent,
  DataMappingComponent,
  ProjectsListPageComponent
];
