import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { getFeatureById } from '../../services/geoserver/wfs.service';
import { WfsFeature } from '../../services/geoserver/wfs-models';
import { OpenLayersService } from '../../services/open-layer/open-layers.service';
import { CommunicationService, ObjectDto } from '../../services/communication.service';
import { TransformFeatureService } from '../../services/geoserver/transform-feature.service';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { DataSchemaService } from '../../services/crg/data-schema.service';
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
              private openLayers: OpenLayersService,
              private communicationService: CommunicationService,
              private dataSchemaService: DataSchemaService,
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

  editFeature() {
    if (this.wfsFeature && this.wfsFeature.properties) {
      const propCopy = Object.assign({}, this.wfsFeature.properties);
      const newProperties = this.getActualValuesFromForm(propCopy);

      const calcAttributes = FeatureUtil.calculateByFunction(propCopy, this.featureDescription.calcFiledFunction);
      Object.keys(calcAttributes).forEach(key => {
        newProperties[key] = calcAttributes[key];
      });

      const crgLayer = this.object.crgLayer;
      const workspaceName = crgLayer.complexName.split(':')[0];

      this.transformFeatureService
          .updateFeature(this.wfsFeature.id, workspaceName, crgLayer.name, newProperties)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => {
            if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
              this.closeMe.emit(true);
              Toast.success('Сохранено');

              // Сразу провалидируем слой при успешном сохранении
              this.communicationService.selectedForValidation.emit([this.data[0].crgLayer]);
              this.openLayers.refreshLayer(this.data[0].crgLayer.complexName);
            } else {
              this.logger.warn('UpdateFeature response: ', response);
              Toast.warn('Не удалось сохранить');
            }
          });
    }
  }

  close() {
    this.closeMe.emit(true);

    this.openLayers.clearDraft();
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
        this.logger.warn('Not found rule by feature name: ', objectDto.crgLayer.name);
      }

      this.openLayers.showFeature(wfsFeature);
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
      const propertySchema = this.dataSchemaService.getPropertySchemaByName(key, this.featureDescription.properties);
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
