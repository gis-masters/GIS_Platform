import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { Relation } from '../../services/data/schema/schema.models';
import { registry } from '../../services/di-registry';
import { RelationsButton } from '../RelationsButton/RelationsButton';

const RelationsButtonWithRegistry = withRegistry(registry)(RelationsButton);

@Component({
  selector: 'crg-relations-button',
  template: '<div class="relations-button" #react></div>',
  styleUrls: ['./relations-button.component.scss']
})
export class RelationsButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() obj?: Record<string, unknown>;
  @Input() relations?: Relation[];
  @Input() size?: 'small' | 'medium' | 'large';
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
    if (!this.obj || !this.relations) {
      return;
    }
    const reactElement = createElement(RelationsButtonWithRegistry, {
      obj: this.obj,
      relations: this.relations,
      size: this.size
    });

    this.root?.render(reactElement);
  }
}
