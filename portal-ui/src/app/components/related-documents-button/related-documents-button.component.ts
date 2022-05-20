import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { RelatedDocumentsButton } from '../RelatedDocumentsButton/RelatedDocumentsButton';
import { Relation } from '../../services/crg/schema.models';
import { registry } from '../../services/registry';

@Component({
  selector: 'crg-related-documents-button',
  template: '<div class="related-documents-button" #react></div>',
  styleUrls: ['./related-documents-button.component.scss']
})
export class RelatedDocumentsButtonComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(withRegistry(registry)(RelatedDocumentsButton), {
      obj: this.obj,
      relations: this.relations,
      size: this.size
    });

    this.root?.render(reactElement);
  }
}
