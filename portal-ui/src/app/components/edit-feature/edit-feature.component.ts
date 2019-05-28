import {NGXLogger} from 'ngx-logger';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent implements OnInit, OnChanges {

  @Input() feature: WfsFeature;
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;
  fProperties: string[];

  constructor(private logger: NGXLogger,
              private openLayers: OpenLayersService,
              private rulesService: FgistpRulesService,
              private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature']) {
      this.openLayers.showFeature(this.feature);

      this.editFeatureForm = this.formBuilder.group({});
      this.fProperties = Object.keys(this.feature.properties)
        .map(key => key)
        .filter(key => key !== 'bbox');

      this.fProperties.forEach(key => {
        const formControl = new FormControl(this.feature.properties[key]);
        this.editFeatureForm.addControl(key, formControl);
      });
    }
  }

  close() {
    this.closeMe.emit(true);

    this.openLayers.clearDraft();
  }

  editFeature() {
    console.log('editFeature');
  }

  getAlias(property: string) {
    return this.rulesService.getPropertyAlias(this.feature.id.split('.')[0], property);
  }
}
