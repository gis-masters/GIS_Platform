import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { IWsMessage } from '../../services/ws.service';
import { WsImportModel } from '../../services/data/processes/processes.models';
import { ImportGmlResultsLink } from '../ImportGmlResultLink/ImportGmlResultsLink';

const ImportGmlResultsLinkWithRegistry = withRegistry(registry)(ImportGmlResultsLink);

@Component({
  selector: 'crg-import-gml-results-button',
  template: '<div class="import-gml-results-button" #react></div>',
  styleUrls: ['./import-gml-result-button.scss']
})
export class ImportGmlResultButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() event?: IWsMessage;
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
    const payload = this.event?.payload as WsImportModel | undefined;
    const reactElement = createElement(ImportGmlResultsLinkWithRegistry, { reports: payload?.payload });

    this.root?.render(reactElement);
  }
}
