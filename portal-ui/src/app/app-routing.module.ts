import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './pages/login/login-page.component';
import { AboutComponent } from './pages/about/about.component';
import { MapPageComponent } from './pages/map/map-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { ProjectsPageComponent } from './pages/projects/projects-page.component';
import { ImportPageComponent } from './pages/import/import-page.component';
import { MappingPageComponent } from './pages/mapping/mapping-page.component';

import { AuthGuardService } from './services/auth-guard.service';
import { WorkflowGuardService } from './services/workflow-guard.service';
import { ProjectsGuardService } from './services/projects-guard.service';
import { OrganizationInfoResolver } from './services/resolvers/project-resolver.service';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'projects/default',
    component: ProjectsPageComponent,
    canActivate: [ AuthGuardService, ProjectsGuardService ],
    resolve: {
      orgInfo: OrganizationInfoResolver
    },
    data: {
      step: 1,
      helpPage: 'projects'
    }
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
    canActivate: [ AuthGuardService ],
    resolve: {
      orgInfo: OrganizationInfoResolver
    },
    data: {
      step: 1,
      helpPage: 'projects'
    }
  },
  {
    path: 'projects/:projectId',
    canActivate: [ AuthGuardService, WorkflowGuardService ],
    children: [
      {
        path: 'import',
        component: ImportPageComponent,
        canActivate: [ AuthGuardService, WorkflowGuardService ],
        resolve: {
          orgInfo: OrganizationInfoResolver
        },
        data: {
          step: 2,
          helpPage: 'import'
        }
      },
      {
        path: 'import/:importId',
        component: ImportPageComponent,
        canActivate: [ AuthGuardService, WorkflowGuardService ],
        resolve: {
          orgInfo: OrganizationInfoResolver
        },
        data: {
          step: 2,
          helpPage: 'import'
        }
      },
      {
        path: 'import/:importId/mapping',
        component: MappingPageComponent,
        canActivate: [ AuthGuardService, WorkflowGuardService ],
        resolve: {
          orgInfo: OrganizationInfoResolver
        },
        data: {
          step: 2,
          helpPage: 'import'
        }
      },
      {
        path: 'map',
        component: MapPageComponent,
        canActivate: [ AuthGuardService, WorkflowGuardService ],
        resolve: {
          orgInfo: OrganizationInfoResolver
        },
        data: {
          step: 3,
          helpPage: 'map'
        }
      },
      {
        path: '**', redirectTo: '../projects'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, WorkflowGuardService, ProjectsGuardService]
})
export class AppRoutingModule { }

export const routingComponents = [
  HomePageComponent,
  MapPageComponent,
  LoginPageComponent,
  AboutComponent,
  RegisterComponent,
  RecoveryComponent,
  ImportPageComponent,
  MappingPageComponent,
  ProjectsPageComponent
];
