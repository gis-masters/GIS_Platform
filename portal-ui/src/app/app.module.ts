import { NgModule, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { configure } from 'mobx';
configure({ enforceActions: 'observed' }); // don't allow state modifications outside actions

import { MaterialModule } from './material.module';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { NgxMaskModule } from 'ngx-mask';
import { FileUploadModule } from 'ng2-file-upload';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';

import { LoadingModule } from './components/loading/loading.module';

import { AppComponent } from './pages/_app/app.component';

import { ProjectsComponent } from './components/projects/projects.component';
import { HeaderComponent } from './components/header/header.component';
import { EditBugObjectComponent } from './components/edit-bug-object/edit-bug-object.component';
import { MappingCardComponent } from './components/mapping-card/mapping-card.component';
import { PickupDatasetsComponent } from './components/pickup-datasets/pickup-datasets.component';
import { MappingPairComponent } from './components/mapping-pair/mapping-pair.component';
import { BugsTableComponent } from './components/validation/bugs-table/bugs-table.component';
import { ReportSidebarComponent } from './components/validation/report-sidebar/report-sidebar.component';
import { ViolationsViewComponent } from './components/validation/violations-view/violations-view.component';
import { ErrorsBadgeComponent } from './components/errors-badge/errors-badge.component';
import { InfoSidebarComponent } from './components/info-sidebar/info-sidebar.component';
import { LayersSidebarComponent } from './components/layers-sidebar/layers-sidebar.component';
import { ProgressItemComponent } from './components/progress-item/progress-item.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { EditFeaturesSidebarComponent } from './components/edit-features-sidebar/edit-features-sidebar.component';
import { EditFeatureComponent } from './components/edit-feature/edit-feature.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { ResizableBarDirective } from './directives/resizableBar.directive';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { DataImportComponent } from './components/data-import/data-import.component';
import { WorkspaceHeaderComponent } from './components/workspace-header/workspace-header.component';
import { WorkspaceContentComponent } from './components/workspace-content/workspace-content.component';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { ServicesProvider } from './components/services-provider/services-provider.component';
import { GlobalErrorHandler } from './services/global-error.handler';
import { WorkImportPreviewComponent } from './components/work-import-preview/work-import-preview.component';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { EditFeatureFieldComponent } from './components/edit-feature-field/edit-feature-field.component';
import { EditFeatureGeometryComponent } from './components/edit-feature-geometry/edit-feature-geometry.component';
import { FeaturesListSidebarComponent } from './components/features-list-sidebar/features-list-sidebar.component';
import { ReValidateButtonComponent } from './components/reValidateButton/reValidateButton.component';
import { OrgAdminComponent } from './components/org-admin/org-admin.component';
import { EditFeatureConfirmComponent } from './components/edit-feature-confirm/edit-feature-confirm.component';
import { BasemapsSelectComponent } from './components/basemaps-select/basemaps-select.component';
import { DataManagementComponent } from './components/data-management/data-management.component';
import { LogoComponent } from './components/logo/logo.component';
import { MapToolbarComponent } from './components/map-toolbar/map-toolbar.component';
import { ExportValidationReportButtonComponent } from './components/export-validation-report-button/export-validation-report-button.component';
import { LoginFormDialogComponent } from './components/login-form-dialog/login-form-dialog.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ImportGmlResultButtonComponent } from './components/import-gml-results-button/import-gml-result-button';
import { LibraryRegistryComponent } from './components/library-registry/library-registry.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormControlComponent } from './components/form-control/form-control.component';
import { LibraryDocumentPageContainerComponent } from './components/library-document-page-container/library-document-page-container.component';
import { ServicesCalculatorComponent } from './components/services-calculator/services-calculator.component';
import { FormDescriptionComponent } from './components/form-description/form-description.component';
import { RestorePasswordFormComponent } from './components/restore-password-form/restore-password-form.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { RelationsButtonComponent } from './components/relations-button/relations-button.component';
import { FeaturesSidebarTeaserComponent } from './components/features-sidebar-teaser/features-sidebar-teaser.component';
import { SystemManagementComponent } from './components/system-management/system-management.component';
import { EditFeatureActionsComponent } from './components/edit-feature-actions/edit-feature-actions.component';

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
    ConfirmDialogComponent,
    EditFeaturesSidebarComponent,
    EditFeatureComponent,
    AttributesComponent,
    ResizableBarDirective,
    PageTitleComponent,
    DataImportComponent,
    WorkspaceHeaderComponent,
    WorkspaceContentComponent,
    HomeComponent,
    MapComponent,
    ServicesProvider,
    WorkImportPreviewComponent,
    AlertDialogComponent,
    WorkspaceComponent,
    EditFeatureFieldComponent,
    EditFeatureGeometryComponent,
    FeaturesListSidebarComponent,
    ReValidateButtonComponent,
    EditFeatureGeometryComponent,
    OrgAdminComponent,
    EditFeatureConfirmComponent,
    BasemapsSelectComponent,
    DataManagementComponent,
    LogoComponent,
    MapToolbarComponent,
    ExportValidationReportButtonComponent,
    LoginFormComponent,
    RestorePasswordFormComponent,
    FooterComponent,
    ImportGmlResultButtonComponent,
    LibraryRegistryComponent,
    LibraryDocumentPageContainerComponent,
    FormControlComponent,
    ServicesCalculatorComponent,
    FormDescriptionComponent,
    ChangePasswordFormComponent,
    FormDescriptionComponent,
    RelationsButtonComponent,
    FeaturesSidebarTeaserComponent,
    SystemManagementComponent,
    EditFeatureActionsComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserModule,
    FileUploadModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs', // send logs to server endpoint
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.WARN
    }),
    NgxMaskModule.forRoot(),
    LoadingModule
  ] as ModuleWithProviders<unknown>[],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
