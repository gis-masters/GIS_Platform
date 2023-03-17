import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/projects/projects.models';
import { EditFeatureActions } from '../EditFeatureActions/EditFeatureActions';

const EditFeatureActionsName = withRegistry(registry)(EditFeatureActions);

@Component({
  selector: 'crg-edit-feature-actions',
  template: '<div class="edit-feature-actions" #react></div>',
  styleUrls: ['./edit-feature-actions.component.scss']
})
export class EditFeatureActionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature: WfsFeature;
  @Input() layer: CrgVectorLayer;
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
    const reactElement = createElement(EditFeatureActionsName, {
      feature: this.feature,
      layer: this.layer
    });

    this.root?.render(reactElement);
  }
}
