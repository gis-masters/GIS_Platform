import { createElement } from 'react';
import { boundMethod } from 'autobind-decorator';
import { render, unmountComponentAtNode } from 'react-dom';
import { Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Dataset } from '../../services/data.service';
import { PickupDatasets } from '../PickupDatasets/PickupDatasets';

@Component({
  selector: 'pickup-datasets',
  template: '<div class="pickup-datasets" #react></div>'
})
export class PickupDatasetsComponent implements OnInit, OnChanges, OnDestroy {
  @Output() datasetSelect = new EventEmitter<Dataset>();
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
    const reactElement = createElement(PickupDatasets, {  onDatasetSelected: this.onDatasetSelected  });

    render(reactElement, this.ref.nativeElement);
  }

  @boundMethod
  private onDatasetSelected(dataset: Dataset) {
    this.datasetSelect.emit(dataset);
  }
}
