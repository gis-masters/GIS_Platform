import { NgModule, ErrorHandler } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { configure } from 'mobx';
configure({ enforceActions: 'observed' }); // don't allow state modifications outside actions

import { MaterialModule } from './material.module';
import { AppRoutingModule, routingComponents } from './app-routing.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule } from 'ngx-mask';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FileUploadModule } from 'ng2-file-upload';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { LoadingModule } from './components/loading/loading.module';

import { FilterLayersPipe } from './pipes/filter-layers.pipe';

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
import { AttributesBarComponent } from './components/attributes-bar/attributes-bar.component';
import { TableFilterComponent } from './components/table-filter/table-filter.component';
import { CopyFeaturesDialogComponent } from './components/dialogs/copy-features-dialog/copy-features-dialog.component';
import { ButtonComponent } from './components/button/button.component';
import { ResizableBarDirective } from './directives/resizableBar.directive';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { DataImportComponent } from './components/data-import/data-import.component';
import { AtleastPipe } from './pipes/atleast.pipe';
import { WorkspaceHeaderComponent } from './components/workspace-header/workspace-header.component';
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
import { ZoomToFeatureComponent } from './components/zoom-to-feature/zoom-to-feature.component';
import { OrgAdminComponent } from './components/org-admin/org-admin.component';
import { EditFeatureConfirmComponent } from './components/edit-feature-confirm/edit-feature-confirm.component';
import { BasemapsSelectComponent } from './components/basemaps-select/basemaps-select.component';
import { DataManagementComponent } from './components/data-management/data-management.component';
import { LogoComponent } from './components/logo/logo.component';
import { MapToolbarComponent } from './components/map-toolbar/map-toolbar.component';
import { CopyUrlButtonComponent } from './components/copy-url-button/copy-url-button.component';
import { ExportValidationReportButtonComponent } from './components/export-validation-report-button/export-validation-report-button.component';
import { LoginFormDialogComponent } from './components/login-form-dialog/login-form-dialog.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OpenInAnotherProjectComponent } from './components/open-in-another-project/open-in-another-project.component';
import { ImportGmlResultButtonComponent } from './components/import-gml-results-button/import-gml-result-button';
import { LibraryRegistryComponent } from './components/library-registry/library-registry.component';
import { XmlDownloadComponent } from './components/xml-download/xml-download.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormControlComponent } from './components/form-control/form-control.component';
import { LibraryDocumentPageContainerComponent } from './components/library-document-page-container/library-document-page-container.component';
import { ServicesCalculatorComponent } from './components/services-calculator/services-calculator.component';
import { FeatureExtractComponent } from './components/feature-extract/feature-extract.component';

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
    FilterLayersPipe,
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
    AttributesBarComponent,
    TableFilterComponent,
    CopyFeaturesDialogComponent,
    ButtonComponent,
    ResizableBarDirective,
    PageTitleComponent,
    DataImportComponent,
    AtleastPipe,
    WorkspaceHeaderComponent,
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
    ZoomToFeatureComponent,
    OrgAdminComponent,
    EditFeatureConfirmComponent,
    BasemapsSelectComponent,
    DataManagementComponent,
    LogoComponent,
    MapToolbarComponent,
    CopyUrlButtonComponent,
    ExportValidationReportButtonComponent,
    LoginFormComponent,
    OpenInAnotherProjectComponent,
    FooterComponent,
    ImportGmlResultButtonComponent,
    LibraryRegistryComponent,
    LibraryDocumentPageContainerComponent,
    XmlDownloadComponent,
    FormControlComponent,
    ServicesCalculatorComponent,
    FeatureExtractComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,

    BrowserModule,
    FileUploadModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs', // send logs to server endpoint
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.WARN
    }),
    NgxMaskModule.forRoot(),
    NgxDatatableModule,
    NgSelectModule,

    LoadingModule
  ],
  entryComponents: [AlertDialogComponent, ConfirmDialogComponent, CopyFeaturesDialogComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
