import { NgModule } from '@angular/core';
import { RouterModule, Route, Data } from '@angular/router';

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
import { OrgAdminGuardService } from './services/org-admin-guard.service';
import { WorkflowGuardService } from './services/workflow-guard.service';
import { ProjectsGuardService } from './services/projects-guard.service';
import { CurrentUserResolver } from './services/resolvers/current-user-resolver.service';
import { OrgAdminPageComponent } from './pages/org-admin/org-admin-page.component';
import { DataManagementPageComponent } from './pages/data-management/data-management-page.component';

export enum Pages {
  HOME = 'home',
  LOGIN = 'login',
  REGISTER = 'register',
  RECOVERY = 'recovery',
  ABOUT = 'about',
  PROJECTS = 'projects',
  IMPORT = 'import',
  MAP = 'map',
  ORG_ADMIN = 'org-admin',
  DATA_MANAGEMENT = 'data-management'
}

export interface AppRouteData extends Data {
  page: Pages;
}

interface AppRoute extends Route {
  data: AppRouteData;
}

interface AppRouteParent extends Route {
  children: AppRoutes;
  data?: AppRouteData;
}

interface AppRouteRedirect extends Route {
  redirectTo: string;
}

type AppRoutes = (AppRoute | AppRouteParent | AppRouteRedirect)[];

const routes: AppRoutes = [
  {
    path: '',
    component: HomePageComponent,
    data: { page: Pages.HOME }
  },
  {
    path: 'login',
    component: LoginPageComponent,
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.LOGIN }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { page: Pages.REGISTER }
  },
  {
    path: 'recovery',
    component: RecoveryComponent,
    data: { page: Pages.RECOVERY }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { page: Pages.ABOUT }
  },
  {
    path: 'projects/default',
    component: ProjectsPageComponent,
    canActivate: [AuthGuardService, ProjectsGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
    canActivate: [AuthGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'projects/:projectId',
    canActivate: [AuthGuardService, WorkflowGuardService],
    children: [
      {
        path: 'import',
        component: ImportPageComponent,
        canActivate: [AuthGuardService, WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.IMPORT }
      },
      {
        path: 'import/:importId',
        component: ImportPageComponent,
        canActivate: [AuthGuardService, WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.IMPORT }
      },
      {
        path: 'import/:importId/mapping',
        component: MappingPageComponent,
        canActivate: [AuthGuardService, WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.IMPORT }
      },
      {
        path: 'map',
        component: MapPageComponent,
        canActivate: [AuthGuardService, WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.MAP }
      },
      {
        path: '**',
        redirectTo: '../projects'
      }
    ]
  },
  {
    path: 'org-admin',
    component: OrgAdminPageComponent,
    canActivate: [OrgAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.ORG_ADMIN }
  },
  {
    path: 'data-management',
    component: DataManagementPageComponent,
    canActivate: [AuthGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.DATA_MANAGEMENT }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, WorkflowGuardService, ProjectsGuardService, OrgAdminGuardService]
})
export class AppRoutingModule {}

export const routingComponents = [
  HomePageComponent,
  MapPageComponent,
  LoginPageComponent,
  AboutComponent,
  RegisterComponent,
  RecoveryComponent,
  ImportPageComponent,
  MappingPageComponent,
  ProjectsPageComponent,
  OrgAdminPageComponent,
  DataManagementPageComponent
];
