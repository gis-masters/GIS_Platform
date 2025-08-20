import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { ExportValidationReportButton } from '../ExportValidationReportButton/ExportValidationReportButton';

const ExportValidationReportButtonWithRegistry = withRegistry(registry)(ExportValidationReportButton);

@Component({
  selector: 'crg-export-validation-report-button',
  template: '<div class="export-validation-report-button" #react></div>',
  styleUrls: ['./export-validation-report-button.component.scss']
})
export class ExportValidationReportButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() layers?: CrgVectorLayer[];
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
    if (!this.layers) {
      return;
    }
    const reactElement = createElement(ExportValidationReportButtonWithRegistry, { layers: this.layers });

    this.root?.render(reactElement);
  }
}
