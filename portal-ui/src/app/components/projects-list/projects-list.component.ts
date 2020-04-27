import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ProjectsList } from '../ProjectsList/ProjectsList';

@Component({
  selector: 'crg-projects-list',
  template: '<div class="projects-list" #react></div>',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnDestroy, OnInit {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit () {
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges () {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ProjectsList);

    render(reactElement, this.ref.nativeElement);
  }
}
