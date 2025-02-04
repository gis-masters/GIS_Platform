import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

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
  ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ProjectsWithRegistry);

    this.root?.render(reactElement);
  }
}
