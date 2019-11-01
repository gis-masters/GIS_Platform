import {NGXLogger} from 'ngx-logger';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/crg/validation.service';
import {WfsFeature, WfsService} from '../../services/geoserver/wfs.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {CommunicationService, ObjectDto} from '../../services/communication.service';
import {TransformFeatureService} from '../../services/geoserver/transform-feature.service';
import {FeaturePropertyValidators, ValidationError} from '../../services/util/FeaturePropertyValidators';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {DataSchemaService, EditFeatureItem, FeatureDescription} from '../../services/crg/data-schema.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'crg-edit-bug-object',
  templateUrl: './edit-bug-object.component.html',
  styleUrls: ['./edit-bug-object.component.css']
})
export class EditBugObjectComponent implements OnChanges, OnInit, OnDestroy {

  @Input() data: ObjectDto[];
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;

  featureDescription: FeatureDescription;
  wfsFeature: WfsFeature;

  editFeatureData: EditFeatureItem[] = [];
  isFeatureTypeLoaded = false;

  private object: ObjectDto;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private wfsService: WfsService,
              private openLayers: OpenLayersService,
              private validationService: ValidationService,
              private communicationService: CommunicationService,
              private dataSchemaService: DataSchemaService,
              private transformFeatureService: TransformFeatureService) {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editFeature() {
    // Сохраняем только те свойства что были затронуты пользователем и валидны
    // Можно заморочится и смотреть что данные не просто затронуты но и не изменились
    const dirtyProperties: EditFeatureItem[] = this.getDirtyAndValidProperties();

    if (this.wfsFeature && this.wfsFeature.properties) {
      const newProperties: {[key: string]: string} = {};
      dirtyProperties.forEach((item: EditFeatureItem) => { // Collect actual value from form
        newProperties[item.name] = this.editFeatureForm.controls[item.name].value;
      });

      const crgLayer = this.object.crgLayer;
      const workspaceName = crgLayer.complexName.split(':')[0];
      this.transformFeatureService
          .updateFeature(this.wfsFeature.id, workspaceName, crgLayer.name, newProperties)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(response => {
            if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
              this.closeMe.emit(true);
              this.snackBar.open('Сохранено', 'X', {duration: 3000});

              // Сразу провалидируем слой при успешном сохранении
              this.communicationService.selectedForValidation.emit([this.data[0].crgLayer]);
            } else {
              this.logger.warn('UpdateFeature response: ', response);
              this.snackBar.open('Не удалось сохранить', 'X', {duration: 6000});
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
      const wfsFeature: WfsFeature = await this.wfsService
                    .getFeatureById(objectDto.crgLayer.complexName, objectDto.id);

      this.isFeatureTypeLoaded = true;

      this.wfsFeature = wfsFeature;
      this.featureDescription = this.dataSchemaService.getFeatureDescriptionByName(objectDto.crgLayer.name);

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

  private getDirtyAndValidProperties(): EditFeatureItem[] {
    const result: EditFeatureItem[] = [];
    if (!this.editFeatureForm.dirty) {
      return result;
    }

    this.editFeatureData.forEach((property: EditFeatureItem) => {
      const formProperty = this.editFeatureForm.controls[property.name];
      if (formProperty.dirty && formProperty.valid) {
        result.push(property);
      }
    });

    return result;
  }


  private validateCustomRules(featureProperties: {}) {
    FeaturePropertyValidators.validateCustomRules(featureProperties, this.featureDescription.customRuleFunction)
      .forEach((validationError: ValidationError) => {
        const control = this.editFeatureForm.controls[validationError.attribute];
        if (control) {
          control.setErrors([validationError.error]);
        }
      });
  }
}
