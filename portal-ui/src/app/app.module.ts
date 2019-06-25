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
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {GeometryPipe} from './pipes/geometry.pipe';
import {FilterLayersPipe} from './pipes/filter-layers.pipe';

import {AppComponent} from './pages/_app/app.component';
import {ProjectComponent} from './pages/work-space/project/project.component';

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
import {CrgStepperComponent} from './components/crg-stepper/crg-stepper.component';
import {DeleteDialogComponent} from './components/delete-dialog/delete-dialog.component';
import {ViewFeaturesComponent} from './components/view-features/view-features.component';
import {EditFeatureComponent} from './components/edit-feature/edit-feature.component';
import {AttributesSidebarComponent} from './components/attributes-sidebar/attributes-sidebar.component';

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
    CrgStepperComponent,
    ProjectComponent,
    DeleteDialogComponent,
    ViewFeaturesComponent,
    EditFeatureComponent,
    AttributesSidebarComponent,
  ],
  imports: [
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
    NgxDatatableModule
  ],
  entryComponents: [
    DeleteDialogComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
