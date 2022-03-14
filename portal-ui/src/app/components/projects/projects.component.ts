import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { Projects } from '../Projects/Projects';

@Component({
  selector: 'crg-projects',
  template: '<div class="projects" #react></div>',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(Projects));

    render(reactElement, this.ref.nativeElement);
  }
}
