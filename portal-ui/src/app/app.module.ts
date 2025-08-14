import { configure } from 'mobx';
import { LayoutModule } from '@angular/cdk/layout';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
configure({ enforceActions: 'observed' }); // don't allow state modifications outside actions

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AttributesNgComponent } from './components/attributes-ng/attributes-ng.component';
import { AttributionComponent } from './components/attribution/attribution.component';
import { BasemapsSelectComponent } from './components/basemaps-select/basemaps-select.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { DataImportComponent } from './components/data-import/data-import.component';
import { DataManagementComponent } from './components/data-management/data-management.component';
import { EditBugObjectComponent } from './components/edit-bug-object/edit-bug-object.component';
import { EditFeatureBoxComponent } from './components/edit-feature/edit-feature.component';
import { EditFeatureActionsComponent } from './components/edit-feature-actions/edit-feature-actions.component';
import { EditFeatureFieldComponent } from './components/edit-feature-field/edit-feature-field.component';
import { EditFeatureGeometryComponent } from './components/edit-feature-geometry/edit-feature-geometry.component';
import { EditFeatureNavigationComponent } from './components/edit-feature-navigation/edit-feature-navigation.component';
import { EditFeaturesSidebarComponent } from './components/edit-features-sidebar/edit-features-sidebar.component';
import { ErrorsBadgeComponent } from './components/errors-badge/errors-badge.component';
import { ExportValidationReportButtonComponent } from './components/export-validation-report-button/export-validation-report-button.component';
import { FeaturesListSidebarComponent } from './components/features-list-sidebar/features-list-sidebar.component';
import { FeaturesSidebarTeaserComponent } from './components/features-sidebar-teaser/features-sidebar-teaser.component';
import { FooterNgComponent } from './components/footer-ng/footer-ng.component';
import { FormControlComponent } from './components/form-control/form-control.component';
import { FormDescriptionComponent } from './components/form-description/form-description.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ImportGmlResultButtonComponent } from './components/import-gml-results-button/import-gml-result-button';
import { InfoSidebarComponent } from './components/info-sidebar/info-sidebar.component';
import { LayersSidebarComponent } from './components/layers-sidebar/layers-sidebar.component';
import { LibraryDocumentPageContainerComponent } from './components/library-document-page-container/library-document-page-container.component';
import { LibraryRegistryComponent } from './components/library-registry/library-registry.component';
import { LoadingNgModule } from './components/loading-ng/loading-ng.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginFormDialogComponent } from './components/login-form-dialog/login-form-dialog.component';
import { LogoNgComponent } from './components/logo-ng/logo-ng.component';
import { MapComponent } from './components/map/map.component';
import { MapToolbarComponent } from './components/map-toolbar/map-toolbar.component';
import { MappingCardComponent } from './components/mapping-card/mapping-card.component';
import { MappingPairComponent } from './components/mapping-pair/mapping-pair.component';
import { MessagesRegistryComponent } from './components/messages-registry/messages-registry.component';
import { OrgAdminComponent } from './components/org-admin/org-admin.component';
import { OrgRegistrationFormComponent } from './components/org-registration-form/org-registration-form.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PhotoModePreviewerComponent } from './components/photo-mode-previewer/photo-mode-previewer.component';
import { PickupDatasetsComponent } from './components/pickup-datasets/pickup-datasets.component';
import { ProgressItemComponent } from './components/progress-item/progress-item.component';
import { ProjectFolderComponent } from './components/project-folder/project-folder.component';
import { ProjectsComponent } from './components/projects-ng/projects-ng.component';
import { RelationsButtonComponent } from './components/relations-button/relations-button.component';
import { RestorePasswordFormComponent } from './components/restore-password-form/restore-password-form.component';
import { ReValidateButtonNgComponent } from './components/reValidateButton-ng/reValidateButton-ng.component';
import { ServicesCalculatorComponent } from './components/services-calculator/services-calculator.component';
import { ServicesProvider } from './components/services-provider/services-provider.component';
import { SystemManagementComponent } from './components/system-management/system-management.component';
import { TaskPageContainerComponent } from './components/task-page-container/task-page-container.component';
import { TasksJournalComponent } from './components/tasks-journal/tasks-journal.component';
import { UtilityDialogsRootComponent } from './components/utility-dialogs-root/utility-dialogs-root.component';
import { BugsTableComponent } from './components/validation/bugs-table/bugs-table.component';
import { ReportSidebarComponent } from './components/validation/report-sidebar/report-sidebar.component';
import { ViolationsViewComponent } from './components/validation/violations-view/violations-view.component';
import { VectorTableRegistryComponent } from './components/vector-table-registry/vector-table-registry.component';
import { WorkImportPreviewComponent } from './components/work-import-preview/work-import-preview.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceContentComponent } from './components/workspace-content/workspace-content.component';
import { WorkspaceHeaderComponent } from './components/workspace-header/workspace-header.component';
import { MaterialModule } from './material.module';
import { AppComponent } from './pages/_app/app.component';
import { GlobalErrorHandler } from './services/global-error.handler';

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    HeaderComponent,
    MappingCardComponent,
    PickupDatasetsComponent,
    MappingPairComponent,
    BugsTableComponent,
    ReportSidebarComponent,
    ViolationsViewComponent,
    EditBugObjectComponent,
    ErrorsBadgeComponent,
    InfoSidebarComponent,
    LayersSidebarComponent,
    LoginFormDialogComponent,
    ProgressItemComponent,
    ProjectsComponent,
    OrgRegistrationFormComponent,
    EditFeaturesSidebarComponent,
    EditFeatureBoxComponent,
    AttributesNgComponent,
    PageTitleComponent,
    DataImportComponent,
    WorkspaceHeaderComponent,
    WorkspaceContentComponent,
    HomeComponent,
    MapComponent,
    ServicesProvider,
    WorkImportPreviewComponent,
    WorkspaceComponent,
    EditFeatureFieldComponent,
    EditFeatureGeometryComponent,
    FeaturesListSidebarComponent,
    ReValidateButtonNgComponent,
    EditFeatureGeometryComponent,
    OrgAdminComponent,
    BasemapsSelectComponent,
    AttributionComponent,
    DataManagementComponent,
    LogoNgComponent,
    MapToolbarComponent,
    ExportValidationReportButtonComponent,
    LoginFormComponent,
    RestorePasswordFormComponent,
    FooterNgComponent,
    ImportGmlResultButtonComponent,
    LibraryRegistryComponent,
    VectorTableRegistryComponent,
    LibraryDocumentPageContainerComponent,
    TaskPageContainerComponent,
    FormControlComponent,
    ServicesCalculatorComponent,
    FormDescriptionComponent,
    ChangePasswordFormComponent,
    FormDescriptionComponent,
    RelationsButtonComponent,
    FeaturesSidebarTeaserComponent,
    SystemManagementComponent,
    EditFeatureActionsComponent,
    MessagesRegistryComponent,
    TasksJournalComponent,
    UtilityDialogsRootComponent,
    PhotoModePreviewerComponent,
    EditFeatureNavigationComponent,
    ProjectFolderComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs', // send logs to server endpoint
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.WARN,
      timestampFormat: 'short'
    }),
    LoadingNgModule
  ],
  providers: [
    DatePipe,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
