import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { TaskPageContainer } from '../TaskPageContainer/TaskPageContainer';

const TaskPageContainerWithRegistry = withRegistry(registry)(TaskPageContainer);

@Component({
  selector: 'crg-task-page-container',
  template: '<div class="task-page-container" #react></div>',
  styleUrls: ['./task-page-container.component.scss']
})
export class TaskPageContainerComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(TaskPageContainerWithRegistry);

    this.root?.render(reactElement);
  }
}
