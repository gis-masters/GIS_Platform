import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { Projects } from '../Projects/Projects';

const ProjectsWithRegistry = withRegistry(registry)(Projects);

@Component({
  selector: 'crg-projects-ng',
  template: '<div class="projects-ng" #react></div>',
  styleUrls: ['./projects-ng.component.scss']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  @ViewChild('react', { read: ElementRef, static: true })
  ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    this.root.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ProjectsWithRegistry);

    this.root?.render(reactElement);
  }
}
