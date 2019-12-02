import {EventEmitter, Injectable, Output} from '@angular/core';

import {GmlDialogData} from '../components/export/export-dilog/export-dialog.component';
import {ValidationDialogData} from '../components/validation/validation-dialog/validation-dialog.component';
import {EditFeatureData} from '../components/edit-feature/edit-feature.component';
import {CrgLayer} from './geoserver/layers.service';
import {Sidebar} from './side-bar-manager.service';
import {WfsFeature} from './geoserver/wfs.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  @Output() sidebarManager = new EventEmitter<Sidebar>();
  @Output() validationDialog = new EventEmitter<ValidationDialogData>();
  @Output() selectedForValidation = new EventEmitter<CrgLayer[]>();
  @Output() gmlDialog = new EventEmitter<GmlDialogData>();
  @Output() editView = new EventEmitter<ObjectDto[]>();
  @Output() featuresUpdate$ = new EventEmitter<EditFeatureData>();
  @Output() selectedFeatures$ = new EventEmitter<WfsFeature[]>();
}

export interface ObjectDto {
  id: string;
  crgLayer: CrgLayer;
}
