import { Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { boundMethod } from 'autobind-decorator';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { Dataset } from '../../services/data/data.service';
import { PickupDatasets } from '../PickupDatasets/PickupDatasets';

const PickupDatasetsWithRegistry = withRegistry(registry)(PickupDatasets);

@Component({
  selector: 'pickup-datasets',
  template: '<div class="pickup-datasets" #react></div>'
})
export class PickupDatasetsComponent implements OnInit, OnChanges, OnDestroy {
  @Output() datasetSelect = new EventEmitter<Dataset>();
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
    const reactElement = createElement(PickupDatasetsWithRegistry, {
      onDatasetSelected: this.onDatasetSelected
    });

    this.root?.render(reactElement);
  }

  @boundMethod
  private onDatasetSelected(dataset: Dataset) {
    this.datasetSelect.emit(dataset);
  }
}
