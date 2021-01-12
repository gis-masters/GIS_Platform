import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { WfsFeature } from '../../../services/geoserver/wfs.models';
import { CrgLayer } from '../../../services/crg/projects.models';

@Component({
  selector: 'crg-copy-features-dialog',
  templateUrl: './copy-features-dialog.component.html',
  styleUrls: ['./copy-features-dialog.component.css']
})
export class CopyFeaturesDialogComponent {

  selectedLayer: CrgLayer;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CopyFeaturesDialogData) {}

}

export interface CopyFeaturesDialogData {
  layers: CrgLayer[];
  objects: WfsFeature[];
  title: string;
}
