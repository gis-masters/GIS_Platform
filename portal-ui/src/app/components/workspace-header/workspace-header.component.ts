import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { WorkspaceHeader } from '../WorkspaceHeader/WorkspaceHeader';

@Component({
  selector: 'crg-workspace-header',
  template: '<div class="workspace-header" #react></div>',
  styleUrls: ['./workspace-header.component.scss']
})
export class WorkspaceHeaderComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(WorkspaceHeader));

    render(reactElement, this.ref.nativeElement);
  }
}
