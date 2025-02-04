import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { Dataset } from '../../services/data/vectorData/vectorData.models';
import { registry } from '../../services/di-registry';
import { PickupDatasets } from '../PickupDatasets/PickupDatasets';

const PickupDatasetsWithRegistry = withRegistry(registry)(PickupDatasets);

@Component({
  selector: 'pickup-datasets',
  template: '<div class="pickup-datasets" #react></div>'
})
export class PickupDatasetsComponent implements OnInit, OnChanges, OnDestroy {
  // eslint-disable-next-line unicorn/prefer-event-target
  @Output() datasetSelect = new EventEmitter<Dataset>();
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
