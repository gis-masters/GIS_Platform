import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { LayersTree } from '../LayersTree/LayersTree';

@Component({
  selector: 'crg-layers-tree',
  template: '<div class="layers-tree" #react></div>',
  styleUrls: ['./layers-tree.component.scss']
})
export class LayersTreeComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit () {
    this.renderReactElement();
  }

  ngOnDestroy () {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges () {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(LayersTree, {});

    render(reactElement, this.ref.nativeElement);
  }
}
