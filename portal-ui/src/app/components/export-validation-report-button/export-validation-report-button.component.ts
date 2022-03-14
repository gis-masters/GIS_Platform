import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { CrgLayer } from '../../services/crg/projects.models';
import { ExportValidationReportButton } from '../ExportValidationReportButton/ExportValidationReportButton';

@Component({
  selector: 'crg-export-validation-report-button',
  template: '<div class="export-validation-report-button" #react></div>',
  styleUrls: ['./export-validation-report-button.component.scss']
})
export class ExportValidationReportButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() layers: CrgLayer[];
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

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
    const reactElement = createElement(withRegistry(registry)(ExportValidationReportButton), { layers: this.layers });

    render(reactElement, this.ref.nativeElement);
  }
}
