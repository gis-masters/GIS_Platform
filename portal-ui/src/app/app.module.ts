import {NgModule} from '@angular/core';
import {LayoutModule} from '@angular/cdk/layout';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material.module';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {PrimeNgModule} from './prime-ng.module';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgxMaskModule} from 'ngx-mask';
import {AlertModule} from 'ngx-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import {LoginFormModule} from './components/login-form/login-form.module';
import {LoadingModule} from './components/loading/loading.module';

import {GeometryPipe} from './pipes/geometry.pipe';
import {FilterLayersPipe} from './pipes/filter-layers.pipe';

import {AppComponent} from './pages/_app/app.component';
import {ProjectsListPageComponent} from './pages/work-space/projects-list/projects-list-page.component';

import {ProjectsListComponent} from './components/projects-list/projects-list.component';
import {HeaderComponent} from './components/header/header.component';
import {EditBugObjectComponent} from './components/edit-bug-object/edit-bug-object.component';
import {MappingCardComponent} from './components/mapping-card/mapping-card.component';
import {MappingPairComponent} from './components/mapping-pair/mapping-pair.component';
import {LayerListItemComponent} from './components/layer-list-item/layer-list-item.component';
import {BugsTableComponent} from './components/validation/bugs-table/bugs-table.component';
import {ReportSidebarComponent} from './components/validation/report-sidebar/report-sidebar.component';
import {ViolationsViewComponent} from './components/validation/violations-view/violations-view.component';
import {LayerObjectsComponent} from './components/layer-objects/layer-objects.component';
import {ValidationDialogComponent} from './components/validation/validation-dialog/validation-dialog.component';
import {ErrorsBadgeComponent} from './components/errors-badge/errors-badge.component';
import {ExportDialogComponent} from './components/export/export-dilog/export-dialog.component';
import {InfoSidebarComponent} from './components/info-sidebar/info-sidebar.component';
import {LayersSidebarComponent} from './components/layers-sidebar/layers-sidebar.component';
import {ProgressItemComponent} from './components/progress-item/progress-item.component';
import {JwtInterceptorService} from './services/interceptors/jwt-interceptor.service';
import {ConfirmDialogComponent} from './components/dialogs/confirm-dialog/confirm-dialog.component';
import {ViewFeaturesComponent} from './components/view-features/view-features.component';
import {EditFeatureComponent} from './components/edit-feature/edit-feature.component';
import {AttributesBarComponent} from './components/attributes-bar/attributes-bar.component';
import {TableFilterComponent} from './components/table-filter/table-filter.component';
import {CopyFeaturesDialogComponent} from './components/dialogs/copy-features-dialog/copy-features-dialog.component';
import {BestMatchingPipe} from './pipes/best-matching.pipe';
import {ButtonComponent} from './components/button/button.component';
import {ResizableBarDirective} from './directives/resizableBar.directive';
import {PageTitleComponent} from './components/page-title/page-title.component';
import {DataImportComponent} from './components/data-import/data-import.component';
import {DataImportTasksListComponent} from './components/data-import-tasks-list/data-import-tasks-list.component';
import {AtleastPipe} from './pipes/atleast.pipe';
import {WorkspaceHeaderComponent} from './components/workspace-header/workspace-header.component';
import {HomeComponent} from './components/home/home.component';
import { TileSourceSelectComponent } from './components/tile-source-select/tile-source-select.component';

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    HeaderComponent,
    MappingCardComponent,
    LayerListItemComponent,
    MappingPairComponent,
    GeometryPipe,
    BugsTableComponent,
    ReportSidebarComponent,
    ViolationsViewComponent,
    ValidationDialogComponent,
    LayerObjectsComponent,
    FilterLayersPipe,
    EditBugObjectComponent,
    ErrorsBadgeComponent,
    ExportDialogComponent,
    InfoSidebarComponent,
    LayersSidebarComponent,
    ProgressItemComponent,
    ProjectsListPageComponent,
    ProjectsListComponent,
    ConfirmDialogComponent,
    ViewFeaturesComponent,
    EditFeatureComponent,
    AttributesBarComponent,
    TableFilterComponent,
    CopyFeaturesDialogComponent,
    BestMatchingPipe,
    ButtonComponent,
    ResizableBarDirective,
    PageTitleComponent,
    DataImportComponent,
    DataImportTasksListComponent,
    AtleastPipe,
    WorkspaceHeaderComponent,
    HomeComponent,
    TileSourceSelectComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    PrimeNgModule,

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

    LoginFormModule,
    LoadingModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    CopyFeaturesDialogComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
