import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { route } from '../../stores/Route.store';
import { MessagesRegistry } from '../MessagesRegistry/MessagesRegistry';

const MessagesRegistryWithRegistry = withRegistry(registry)(MessagesRegistry);

@Component({
  selector: 'crg-messages-registry',
  template: '<div class="messages-registry" #react></div>',
  styleUrls: ['./messages-registry.component.scss']
})
export class MessagesRegistryComponent implements OnInit, OnChanges, OnDestroy {
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
    const messagesRegistryTableName = route.params.tableName;

    const reactElement = createElement(MessagesRegistryWithRegistry, {
      messagesRegistryTableName,
      id: 'messagesRegistryPage',
      urlChangeEnabled: true
    });

    this.root?.render(reactElement);
  }
}
