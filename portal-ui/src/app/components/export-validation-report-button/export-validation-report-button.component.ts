import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ExportValidationReportButton } from '../ExportValidationReportButton/ExportValidationReportButton';
import { CrgLayer } from '../../services/crg/projects.models';

@Component({
  selector: 'crg-export-validation-report-button',
  template: '<div class="export-validation-report-button" #react></div>',
  styleUrls: ['./export-validation-report-button.component.scss']
})
export class ExportValidationReportButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() layers: CrgLayer[];
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

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
    const reactElement = createElement(ExportValidationReportButton, { layers: this.layers });

    render(reactElement, this.ref.nativeElement);
  }
}
