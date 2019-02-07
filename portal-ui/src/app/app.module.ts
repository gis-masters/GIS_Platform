import {NgModule} from '@angular/core';
import {LayoutModule} from '@angular/cdk/layout';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material.module';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {PrimeNgModule} from './prime-ng.module';

import {AlertModule} from 'ngx-bootstrap';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {AppComponent} from './pages/_app/app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {LayerListItemComponent} from './components/layer-list-item/layer-list-item.component';
import {MappingCardComponent} from './components/mapping-card/mapping-card.component';
import {MappingPairComponent} from './components/mapping-pair/mapping-pair.component';
import {TestGithubComponent} from './components/test-github/test-github.component';
import {FileUploadModule} from 'ng2-file-upload';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JwtInterceptorService} from "./services/jwt-interceptor.service";
import {GeometryPipe} from './pipes/geometry.pipe';
import {NgxMaskModule} from 'ngx-mask';
import {ViolationItemViewComponent} from './components/violation-item-view/violation-item-view.component';
import {LayerObjectsComponent} from './components/layer-objects/layer-objects.component';

@NgModule({
  declarations: [
    routingComponents,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MappingCardComponent,
    LayerListItemComponent,
    MappingPairComponent,
    GeometryPipe,
    TestGithubComponent,
    ViolationItemViewComponent,
    LayerObjectsComponent,
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
    PrimeNgModule,

    BrowserModule,
    FileUploadModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    LayoutModule,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs', // send logs to server endpoint
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.WARN
    }),
    NgxMaskModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
