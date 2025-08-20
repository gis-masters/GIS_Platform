import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { TasksJournal } from '../TasksJournal/TasksJournal';

const TasksJournalWithRegistry = withRegistry(registry)(TasksJournal);

@Component({
  selector: 'crg-tasks-journal',
  template: '<div class="tasks-journal" #react></div>',
  styleUrls: ['./tasks-journal.component.scss']
})
export class TasksJournalComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(TasksJournalWithRegistry);

    this.root?.render(reactElement);
  }
}
