import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { RelationsButton } from '../RelationsButton/RelationsButton';
import { Relation } from '../../services/data/schema.models';
import { registry } from '../../services/di-registry';

const RelationsButtonWithRegistry = withRegistry(registry)(RelationsButton);

@Component({
  selector: 'crg-relations-button',
  template: '<div class="relations-button" #react></div>',
  styleUrls: ['./relations-button.component.scss']
})
export class RelationsButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() obj: Record<string, unknown>;
  @Input() relations: Relation[];
  @Input() size?: 'small' | 'medium' | 'large';
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(RelationsButtonWithRegistry, {
      obj: this.obj,
      relations: this.relations,
      size: this.size
    });

    this.root?.render(reactElement);
  }
}
