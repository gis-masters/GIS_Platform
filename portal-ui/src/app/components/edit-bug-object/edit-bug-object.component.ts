import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

import { getFeatureById } from '../../services/geoserver/wfs.service';
import { WfsFeature } from '../../services/geoserver/wfs-models';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { communicationService, ObjectDto } from '../../services/communication.service';
import { TransformFeatureService } from '../../services/geoserver/transform-feature.service';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { dataSchemaService } from '../../services/crg/data-schema.service';
import { FeatureUtil } from '../../services/util/FeatureUtil';
import { BaseEdit } from './base-edit';
import { Toast } from '../Toast/Toast';

@Component({
  selector: 'crg-edit-bug-object',
  templateUrl: './edit-bug-object.component.html',
  styleUrls: ['./edit-bug-object.component.css']
})
export class EditBugObjectComponent extends BaseEdit implements OnChanges, OnInit {

  @Input() data: ObjectDto[];
  @Output() closeMe = new EventEmitter<boolean>();

  wfsFeature: WfsFeature;

  isFeatureTypeLoaded = false;

  private object: ObjectDto;

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private transformFeatureService: TransformFeatureService) {
    super();
  }

  ngOnInit(): void {
    this.editFeatureForm = this.formBuilder.group({});
    this.editFeatureForm.valueChanges.subscribe(featureProperties => {
      this.validateCustomRules(featureProperties);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];

    if (dataChanged) {
      if (dataChanged.currentValue) {
        // TODO: Берем только первое значение(В таблице пока нельзя выбирать)
        const newObject = Object.assign({}, dataChanged.currentValue[0]);

        this.object = newObject;
        this.handleObject(newObject);
      }
    }
  }

  async editFeature() {
    if (this.wfsFeature && this.wfsFeature.properties) {
      const crgLayer = this.object.crgLayer;
      const workspaceName = crgLayer.complexName.split(':')[0];

      const response = await this.transformFeatureService.updateFeatures(
                                                                    [this.wfsFeature],
                                                                    workspaceName,
                                                                    this.featureDescription,
                                                                    this.getActualValuesFromForm());
      if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
        this.closeMe.emit(true);
        Toast.success('Сохранено');

        // Сразу провалидируем слой при успешном сохранении
        communicationService.selectedForValidation.emit([this.data[0].crgLayer]);
        openLayersService.refreshLayers();
      } else {
        this.logger.warn('UpdateFeature response: ', response);
        Toast.warn('Не удалось сохранить');
      }
    }
  }

  close() {
    this.closeMe.emit(true);

    openLayersService.clearDraft();
  }

  private async handleObject(objectDto: ObjectDto) {
    try {
      const wfsFeature: WfsFeature = await getFeatureById(objectDto.crgLayer.complexName, objectDto.id);

      this.isFeatureTypeLoaded = true;

      this.wfsFeature = wfsFeature;
      this.featureDescription = objectDto.crgLayer.schema;

      if (!!this.featureDescription) {
        this.prepareEditForm(this.wfsFeature.properties);
      } else {
        this.logger.warn('Layer has not the schema?: ', objectDto.crgLayer.schemaId);
      }

      openLayersService.highlightFeature(wfsFeature);
    } catch (err) {
      this.isFeatureTypeLoaded = true;
    }
  }

  /**
   * Генерим форму
   *
   * @param featureProperties Свойства полученные из "фичи" геосервера
   */
  private prepareEditForm(featureProperties: any) {
    for (const key of Object.keys(featureProperties)) {
      if (key === 'bbox') {
        return;
      }

      const currentValue = featureProperties[key]; // Текущее значение свойства на геосервере
      const propertySchema = dataSchemaService.getPropertySchemaByName(key, this.featureDescription.properties);
      if (propertySchema) {

        const formControl = new FormControl({value: currentValue, disabled: propertySchema.name === 'GLOBALID'}, {
          validators: [
            FeaturePropertyValidators.validate(propertySchema),
          ],
          // updateOn: 'blur'
        });

        // Наполняем форму
        this.editFeatureForm.addControl(key, formControl);
        this.editFeatureData.push({
          name: key,
          property: propertySchema,
          value: currentValue,
          isFgistpProperty: true
        });
      } else {
        this.editFeatureForm.addControl(key, new FormControl(currentValue));
        this.editFeatureData.push({
          name: key,
          property: {
            name: key,
            title: key,
            valueType: 'STRING',
          },
          value: currentValue,
          isFgistpProperty: false
        });

        this.logger.info('Свойство: ' + key + ' отсутствует в описании типа по приказу');
      }
    }

    setTimeout(() => {
      this.validateCustomRules(featureProperties);
    }, 22);
  }

}
