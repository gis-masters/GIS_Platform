import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Projects } from '../Projects/Projects';

@Component({
  selector: 'crg-projects',
  template: '<div class="projects" #react></div>',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnDestroy, OnInit {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

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
    const reactElement = createElement(Projects);

    render(reactElement, this.ref.nativeElement);
  }
}
