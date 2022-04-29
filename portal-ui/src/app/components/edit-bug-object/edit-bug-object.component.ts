import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { debounceTime } from 'rxjs/operators';

import { BaseEdit } from './base-edit';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { getFeatureById } from '../../services/geoserver/wfs.service';
import { mapService } from '../../services/map/map.service';
import { communicationService, ObjectDto } from '../../services/communication.service';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { validationService } from '../../services/crg/validation.service';
import { schemaService } from '../../services/crg/schema.service';
import { ValueType } from '../../services/crg/schemaOld.models';
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

  constructor(private formBuilder: FormBuilder, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.editFeatureForm = this.formBuilder.group({});
    this.editFeatureForm.valueChanges.pipe(debounceTime(50)).subscribe((featureProperties: Record<string, unknown>) => {
      this.validateCustomRules(featureProperties);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes.data;

    if (dataChanged && dataChanged.currentValue) {
      // TODO: Берем только первое значение(В таблице пока нельзя выбирать)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const newObject = Object.assign({}, dataChanged.currentValue[0] as ObjectDto);

      this.object = newObject;
      void this.handleObject(newObject);
    }
  }

  async editFeature(): Promise<void> {
    const { crgLayer } = this.data[0];
    if (this.wfsFeature && this.wfsFeature.properties) {
      const response = await transformFeature.updateFeatures(
        crgLayer.tableName,
        [this.wfsFeature],
        this.featureDescription,
        this.getActualValuesFromForm()
      );

      if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
        this.closeMe.emit(true);
        Toast.success('Сохранено');

        mapService.refreshLayers();
        await validationService.initValidation([crgLayer]);
        communicationService.needUpdateValidationResults.emit();
      } else {
        this.logger.warn('UpdateFeature response: ', response);
        Toast.warn('Не удалось сохранить');
      }
    }
  }

  close(): void {
    this.closeMe.emit(true);

    mapService.clearDraft();
  }

  private async handleObject(objectDto: ObjectDto) {
    try {
      const wfsFeature: WfsFeature = await getFeatureById(objectDto.crgLayer.complexName, objectDto.id);

      this.isFeatureTypeLoaded = true;

      this.wfsFeature = wfsFeature;
      this.featureDescription = await schemaService.getOldSchema(objectDto.crgLayer.schemaId);

      if (this.featureDescription) {
        this.prepareEditForm(this.wfsFeature.properties);
      } else {
        this.logger.warn('Layer has not the schema?: ', objectDto.crgLayer.schemaId);
      }

      mapService.highlightFeatures([wfsFeature]);
    } catch {
      this.isFeatureTypeLoaded = true;
    }
  }

  /**
   * Генерим форму
   *
   * @param featureProperties Свойства полученные из "фичи" геосервера
   */
  private prepareEditForm(featureProperties: Record<string, unknown>) {
    for (const key of Object.keys(featureProperties)) {
      if (key === 'bbox') {
        return;
      }

      const currentValue = featureProperties[key]; // Текущее значение свойства на геосервере
      const propertySchema = schemaService.getPropertySchemaByName(key, this.featureDescription.properties);
      if (propertySchema) {
        const formControl = new FormControl(
          { value: currentValue, disabled: propertySchema.name === 'GLOBALID' },
          {
            validators: [FeaturePropertyValidators.validate(propertySchema)]
            // updateOn: 'blur'
          }
        );

        // Наполняем форму
        this.editFeatureForm.addControl(key, formControl);
        this.editFeatureData.push({
          name: key,
          property: propertySchema,
          value: String(currentValue),
          isFgistpProperty: true
        });
      } else {
        this.editFeatureForm.addControl(key, new FormControl(currentValue));
        this.editFeatureData.push({
          name: key,
          property: {
            name: key,
            title: key,
            valueType: ValueType.STRING
          },
          value: String(currentValue),
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
