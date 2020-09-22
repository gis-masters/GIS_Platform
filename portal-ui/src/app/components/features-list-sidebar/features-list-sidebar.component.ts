import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { boundMethod } from 'autobind-decorator';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { FeaturesListSidebar } from '../FeaturesListSidebar/FeaturesListSidebar';

@Component({
  selector: 'crg-features-list-sidebar',
  template: '<div class="features-list-sidebar" #react></div>',
  styleUrls: ['./features-list-sidebar.component.scss']
})
export class FeaturesListSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() features: WfsFeature[];
  @Input() layerTitle: string;
  @Output() onItemSelect = new EventEmitter<WfsFeature>();
  @Output() onItemHighlight = new EventEmitter<WfsFeature>();
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
    const reactElement = createElement(FeaturesListSidebar, {});

    render(reactElement, this.ref.nativeElement);
  }

  @boundMethod
  private itemSelectHandler (item: WfsFeature) {
    this.onItemSelect.emit(item);
  }
  
  @boundMethod
  private itemHighlightHandler (item: WfsFeature) {
    this.onItemHighlight.emit(item);
  }
}
