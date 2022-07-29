import { NgModule } from '@angular/core';
import { RouterModule, Route, Data } from '@angular/router';

import { CurrentUserResolver } from './services/resolvers/current-user-resolver.service';
import { OrgAdminGuardService } from './services/org-admin-guard.service';
import { WorkflowGuardService } from './services/workflow-guard.service';
import { ProjectsGuardService } from './services/projects-guard.service';
import { AboutComponent } from './pages/about/about.component';
import { MapPageComponent } from './pages/map/map-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { ImportPageComponent } from './pages/import/import-page.component';
import { MappingPageComponent } from './pages/mapping/mapping-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page.component';
import { OrgAdminPageComponent } from './pages/org-admin/org-admin-page.component';
import { DataManagementPageComponent } from './pages/data-management/data-management-page.component';
import { LibraryDocumentPageComponent } from './pages/library-document/library-document-page.component';
import { LibraryRegistryPageComponent } from './pages/library-registry/library-registry-page.component';
import { ServicesCalculatorPageComponent } from './pages/services-calculator/services-calculator-page.component';
import { RestorePasswordFormPageComponent } from './pages/restore-password-form/restore-password-form-page.component';
import { ChangePasswordFormPageComponent } from './pages/change-password-form/change-password-form-page.component';

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
  DATA_MANAGEMENT = 'data-management',
  REGISTRY = 'registry',
  DOCUMENT = 'document',
  SERVICES_CALCULATOR = 'services-calculator',
  RESTORE_PASSWORD = 'restore-password',
  CHANGE_PASSWORD = 'change-password'
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
    path: 'register',
    component: RegisterComponent,
    data: { page: Pages.REGISTER }
  },
  {
    path: 'restore-password',
    component: RestorePasswordFormPageComponent,
    data: { page: Pages.RESTORE_PASSWORD }
  },
  {
    path: 'password-reset/:token',
    component: ChangePasswordFormPageComponent,
    data: { page: Pages.CHANGE_PASSWORD }
  },
  {
    path: 'services-calculator',
    component: ServicesCalculatorPageComponent,
    data: { page: Pages.SERVICES_CALCULATOR }
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
    canActivate: [ProjectsGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'projects/:projectId',
    canActivate: [WorkflowGuardService],
    children: [
      {
        path: 'import',
        component: ImportPageComponent,
        canActivate: [WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.IMPORT }
      },
      {
        path: 'import/:importId',
        component: ImportPageComponent,
        canActivate: [WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.IMPORT }
      },
      {
        path: 'import/:importId/mapping',
        component: MappingPageComponent,
        canActivate: [WorkflowGuardService],
        resolve: {
          user: CurrentUserResolver
        },
        data: { page: Pages.IMPORT }
      },
      {
        path: 'map',
        component: MapPageComponent,
        canActivate: [WorkflowGuardService],
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
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.DATA_MANAGEMENT }
  },
  {
    path: 'data-management/library/:libraryId/registry',
    component: LibraryRegistryPageComponent,
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.REGISTRY }
  },
  {
    path: 'data-management/library/:libraryId/document/:documentId',
    component: LibraryDocumentPageComponent,
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.DOCUMENT }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [WorkflowGuardService, ProjectsGuardService, OrgAdminGuardService]
})
export class AppRoutingModule {}

export const routingComponents = [
  HomePageComponent,
  MapPageComponent,
  AboutComponent,
  RegisterComponent,
  RecoveryComponent,
  ImportPageComponent,
  MappingPageComponent,
  ProjectsPageComponent,
  OrgAdminPageComponent,
  DataManagementPageComponent,
  LibraryRegistryPageComponent,
  LibraryDocumentPageComponent,
  ServicesCalculatorPageComponent,
  RestorePasswordFormPageComponent,
  ChangePasswordFormPageComponent
];
