import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { debounceTime } from 'rxjs/operators';

import { BaseEdit } from './base-edit';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { mapService } from '../../services/map/map.service';
import { communicationService, ObjectDto } from '../../services/communication.service';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { initValidation } from '../../services/data/validation/validation.service';
import { schemaService } from '../../services/data/schema/schema.service';
import { ValueType } from '../../services/data/schema/schemaOld.models';
import { Toast } from '../Toast/Toast';

@Component({
  selector: 'crg-edit-bug-object',
  templateUrl: './edit-bug-object.component.html',
  styleUrls: ['./edit-bug-object.component.css']
})
export class EditBugObjectComponent extends BaseEdit implements OnChanges, OnInit, OnDestroy {
  @Input() data: ObjectDto[];
  // eslint-disable-next-line unicorn/prefer-event-target
  @Output() closeMe = new EventEmitter<boolean>();

  wfsFeature: WfsFeature;

  isFeatureTypeLoaded = false;

  private object: ObjectDto;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private logger: NGXLogger
  ) {
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    mapService.clearDraft();
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

        mapService.refreshAllLayers();
        await initValidation([crgLayer]);
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
      const [wfsFeature] = await getFeaturesById([objectDto.id], objectDto.crgLayer.complexName);

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
        const formControl = new UntypedFormControl(
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
        this.editFeatureForm.addControl(key, new UntypedFormControl(currentValue));
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
