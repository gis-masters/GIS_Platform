import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { CrgVectorLayer } from '../../services/crg/projects.models';
import { ExportValidationReportButton } from '../ExportValidationReportButton/ExportValidationReportButton';

@Component({
  selector: 'crg-export-validation-report-button',
  template: '<div class="export-validation-report-button" #react></div>',
  styleUrls: ['./export-validation-report-button.component.scss']
})
export class ExportValidationReportButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() layers: CrgVectorLayer[];
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
    const reactElement = createElement(withRegistry(registry)(ExportValidationReportButton), { layers: this.layers });

    this.root?.render(reactElement);
  }
}
