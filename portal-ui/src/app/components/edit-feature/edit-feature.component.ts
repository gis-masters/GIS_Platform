import {NGXLogger} from 'ngx-logger';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FgistpRulesService} from '../../services/gis/fgistp-rules.service';
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
  private fProperties: string[];

  constructor(private logger: NGXLogger,
              private rulesService: FgistpRulesService,
              private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.editFeatureForm = this.formBuilder.group({});
    if (changes['feature']) {
      this.fProperties = Object.keys(this.feature.properties).map(key => key);
      this.fProperties.forEach(key => {
        const formControl = new FormControl(this.feature.properties[key]);
        this.editFeatureForm.addControl(key, formControl);
      });
    }
  }

  close() {
    this.closeMe.emit(true);
  }

  editFeature() {
    console.log('editFeature');
  }

  getAlias(property: string) {
    return this.rulesService.getPropertyAlias(this.feature.id.split('.')[0], property);
  }
}
