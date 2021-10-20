import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { IWsMessage } from '../../services/ws.service';
import { WsImportGmlModel } from '../../services/crg/processes.service';
import { ImportGmlResultsLink } from '../ImportGmlResultLink/ImportGmlResultsLink';

@Component({
  selector: 'crg-import-gml-results-button',
  template: '<div class="import-gml-results-button" #react></div>',
  styleUrls: ['./import-gml-result-button.scss']
})
export class ImportGmlResultButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() event: IWsMessage;
  @ViewChild('react', { read: ElementRef, static: true })
  ref: ElementRef;

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
    let payload = this.event.payload as WsImportGmlModel;
    const reactElement = createElement(ImportGmlResultsLink, { reports: payload.payload });

    render(reactElement, this.ref.nativeElement);
  }
}
