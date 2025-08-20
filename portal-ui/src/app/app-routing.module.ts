import { NgModule } from '@angular/core';
import { Data, Route, RouterModule } from '@angular/router';

import { AboutComponent } from './pages/about/about.component';
import { ChangePasswordFormPageComponent } from './pages/change-password-form/change-password-form-page.component';
import { DataManagementPageComponent } from './pages/data-management/data-management-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { ImportPageComponent } from './pages/import/import-page.component';
import { LibraryDocumentPageComponent } from './pages/library-document/library-document-page.component';
import { LibraryRegistryPageComponent } from './pages/library-registry/library-registry-page.component';
import { MapPageComponent } from './pages/map/map-page.component';
import { MappingPageComponent } from './pages/mapping/mapping-page.component';
import { MessagesRegistryPageComponent } from './pages/messages-registry/messages-registry-page.component';
import { OrgAdminPageComponent } from './pages/org-admin/org-admin-page.component';
import { PhotoUploaderPageComponent } from './pages/photo-uploader/photo-uploader-page.component';
import { ProjectFolderPageComponent } from './pages/project-folder/project-folder-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RegisterComponent } from './pages/register/register.component';
import { RestorePasswordFormPageComponent } from './pages/restore-password-form/restore-password-form-page.component';
import { ServicesCalculatorPageComponent } from './pages/services-calculator/services-calculator-page.component';
import { SystemManagementPageComponent } from './pages/system-management/system-management-page.component';
import { TaskPageComponent } from './pages/task/task-page.component';
import { TasksJournalPageComponent } from './pages/tasks-journal/tasks-journal-page.component';
import { TestDataPreparationPageComponent } from './pages/test-data-preparation/test-data-preparation-page.component';
import { VectorTableRegistryPageComponent } from './pages/vector-table-registry/vector-table-registry-page.component';
import { OrgAdminGuardService } from './services/guards/org-admin-guard.service';
import { ProjectsGuardService } from './services/guards/projects-guard.service';
import { SystemAdminGuardService } from './services/guards/system-admin-guard.service';
import { SystemManagementGuardService } from './services/guards/system-management-guard.service';
import { WorkflowGuardService } from './services/guards/workflow-guard.service';
import { CurrentUserResolver } from './services/resolvers/current-user-resolver.service';
import { Pages } from './stores/Route.store';

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
    path: 'photo',
    component: PhotoUploaderPageComponent,
    data: { page: Pages.PHOTO_UPLOADER }
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
    canActivate: [ProjectsGuardService, SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'projects/:projectId',
    canActivate: [WorkflowGuardService, SystemAdminGuardService],
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
    canActivate: [OrgAdminGuardService, SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.ORG_ADMIN }
  },
  {
    path: 'system-management',
    component: SystemManagementPageComponent,
    canActivate: [SystemManagementGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.SYSTEM_MANAGEMENT }
  },
  {
    path: 'data-management',
    component: DataManagementPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.DATA_MANAGEMENT }
  },
  {
    path: 'data-management/library/:libraryTableName/registry',
    component: LibraryRegistryPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.REGISTRY }
  },
  {
    path: 'data-management/dataset/:dataset/vectorTable/:vectorTable/registry',
    component: VectorTableRegistryPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.REGISTRY }
  },
  {
    path: 'data-management/messages-registries/:tableName/registry',
    component: MessagesRegistryPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.REGISTRY }
  },
  {
    path: 'data-management/tasks-journal',
    component: TasksJournalPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.TASKS_JOURNAL }
  },
  {
    path: 'data-management/tasks-journal/:taskId',
    component: TaskPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.TASK }
  },
  {
    path: 'data-management/library/:libraryTableName/document/:documentId',
    component: LibraryDocumentPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.DOCUMENT }
  },
  {
    path: 'data-management/projectFolder/:projectId',
    component: ProjectFolderPageComponent,
    canActivate: [SystemAdminGuardService],
    resolve: {
      user: CurrentUserResolver
    },
    data: { page: Pages.PROJECTS }
  },
  {
    path: 'test-data-preparation',
    component: TestDataPreparationPageComponent,
    data: { page: Pages.TEST_DATA_PREPARATION }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [WorkflowGuardService, ProjectsGuardService, OrgAdminGuardService]
})
export class AppRoutingModule {}

export const routingComponents = [
  HomePageComponent,
  PhotoUploaderPageComponent,
  MapPageComponent,
  AboutComponent,
  RegisterComponent,
  RecoveryComponent,
  ImportPageComponent,
  MappingPageComponent,
  ProjectsPageComponent,
  OrgAdminPageComponent,
  SystemManagementPageComponent,
  DataManagementPageComponent,
  LibraryRegistryPageComponent,
  VectorTableRegistryPageComponent,
  LibraryDocumentPageComponent,
  TaskPageComponent,
  ServicesCalculatorPageComponent,
  RestorePasswordFormPageComponent,
  ChangePasswordFormPageComponent,
  MessagesRegistryPageComponent,
  TasksJournalPageComponent,
  TestDataPreparationPageComponent,
  ProjectFolderPageComponent
];
