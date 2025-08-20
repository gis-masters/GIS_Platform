import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { ProjectFolderPage } from '../ProjectFolderPage/ProjectFolderPage';

const ProjectFolderWithRegistry = withRegistry(registry)(ProjectFolderPage);

@Component({
  selector: 'crg-project-folder',
  template: '<div class="project-folder" #react></div>',
  styleUrls: ['./project-folder.component.scss']
})
export class ProjectFolderComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ProjectFolderWithRegistry);

    this.root?.render(reactElement);
  }
}
