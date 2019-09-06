import {
  Component,
  AfterViewInit,
  OnDestroy,
  NgModuleRef,
  NgModule,
  ViewChild,
  ViewContainerRef,
  Compiler,
  Injector
} from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'crg-projects-list',
  template: '<div #here></div>'
})
export class ProjectsListComponent implements AfterViewInit, OnDestroy {
  moduleRef: NgModuleRef<NgModule>;

  @ViewChild('here', { read: ViewContainerRef })
  here: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector) {}

  ngAfterViewInit(): void {
    import(`./projects-list@${environment.platform}.module`)
      .then(m => m.ProjectsListModule)
      .then(lazyModule => {
        this.compiler.compileModuleAsync(lazyModule).then(ngModuleFactory => {
          this.moduleRef = ngModuleFactory.create(this.injector);
          const compFactory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(
            lazyModule.rootEntry
          );
          this.here.createComponent(compFactory);
        });
      });
  }

  ngOnDestroy(): void {
    if (this.moduleRef) {
      this.moduleRef.destroy();
    }
  }
}
