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

import { getEnvironment } from '../../services/environment';

@Component({
  selector: 'crg-projects-list',
  template: '<div #here></div>'
})
export class ProjectsListComponent implements AfterViewInit, OnDestroy {
  moduleRef: NgModuleRef<NgModule>;

  @ViewChild('here', { read: ViewContainerRef, static: true })
  here: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector) {}

  async ngAfterViewInit() {
    const environment = await getEnvironment();
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
