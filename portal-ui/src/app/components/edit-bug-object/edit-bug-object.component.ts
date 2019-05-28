import {NGXLogger} from 'ngx-logger';
import {debounceTime} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/gis/validation.service';
import {WfsFeature, WfsService} from '../../services/geoserver/wfs.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {CommunicationService, ObjectDto} from '../../services/communication.service';
import {TransformFeatureService} from '../../services/gis/transform-feature.service';
import {FeaturePropertyValidators} from '../../services/util/FeaturePropertyValidators';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FgistpRulesService, SimpleProperty, XsdFeature} from '../../services/gis/fgistp-rules.service';

@Component({
  selector: 'crg-edit-bug-object',
  templateUrl: './edit-bug-object.component.html',
  styleUrls: ['./edit-bug-object.component.css']
})
export class EditBugObjectComponent implements OnChanges, OnInit {

  @Input() data: ObjectDto[];
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;

  featureType: XsdFeature;
  wfsFeature: WfsFeature;

  editFeatureData: EditFeatureItem[] = [];
  isFeatureTypeLoaded = false;

  objectValidationResult: string[];

  private object: ObjectDto;

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private wfsService: WfsService,
              private openLayers: OpenLayersService,
              private validationService: ValidationService,
              private communicationService: CommunicationService,
              private rulesService: FgistpRulesService,
              private transformFeatureService: TransformFeatureService) {
  }

  ngOnInit(): void {
    this.editFeatureForm = this.formBuilder.group({});

    this.editFeatureForm.valueChanges
        .pipe(debounceTime(100))
        .subscribe(val => {
          // const newFeatureProperties = Object.assign({}, this.wfsFeature.properties);
          this.objectValidationResult = FeaturePropertyValidators.customRules(val, this.featureType);

          // this.logger.info('!!!!!!!!!!!!!!!!!', val);
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
    // Сохраняем только те свойства что были затронуты пользователем и валидны
    // Можно заморочится и смотреть что данные не просто затронуты но и не изменились
    const dirtyProperties: EditFeatureItem[] = this.getDirtyAndValidProperties();

    if (this.wfsFeature && this.wfsFeature.properties) {
      const newProperties = {};
      dirtyProperties.forEach((item: EditFeatureItem) => { // Collect actual value from form
        newProperties[item.name] = this.editFeatureForm.controls[item.name].value;
      });

      this.transformFeatureService
          .updateFeature(this.wfsFeature, newProperties, this.object.crgLayer)
          .subscribe(response => {
            if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
              this.closeMe.emit(true);
              this.snackBar.open('Сохранено', 'X', {duration: 3000});

              // Сразу провалидируем слой при успешном сохранении
              this.communicationService.selectedForValidation.emit([this.data[0].crgLayer]);
            } else {
              this.logger.warn('UpdateFeature response: ', response);
              this.snackBar.open('Неудалось сохранить', 'X', {duration: 6000});
            }
          });
    }
  }

  private handleObject(objectDto: ObjectDto) {
    this.wfsService
        .getFeatureById(objectDto.crgLayer.complexName, objectDto.id)
        .subscribe((wfsFeature: WfsFeature) => {
          this.isFeatureTypeLoaded = true;

          this.wfsFeature = wfsFeature;
          this.featureType = this.rulesService.getFeatureByName(objectDto.crgLayer.name);
          if (!!this.featureType) {
            this.prepareEditForm(this.wfsFeature.properties);
          } else {
            this.logger.warn('Not found rule by feature name: ', objectDto.crgLayer.name);
          }

          this.openLayers.showFeature(wfsFeature);
        }, error1 => {
          this.isFeatureTypeLoaded = true;
        });
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
      const property = this.getPropertiesByName(key, this.featureType.properties);
      if (property) {
        // Добавляем валидации
        const formControl = new FormControl(currentValue, {
          validators: [
            FeaturePropertyValidators.required(property),
            FeaturePropertyValidators.minLength(property),
            FeaturePropertyValidators.maxLength(property),
            FeaturePropertyValidators.enumeration(property),
            FeaturePropertyValidators.totalDigits(property),
            FeaturePropertyValidators.pattern(property),
            FeaturePropertyValidators.minInclusive(property),
            FeaturePropertyValidators.maxInclusive(property),
            FeaturePropertyValidators.byType(property),
            // allowedValues?: string[];
          ],
          // updateOn: 'blur'
        });

        // Наполняем форму
        this.editFeatureForm.addControl(key, formControl);
        this.editFeatureData.push({
          name: key,
          property: property,
          value: currentValue
        });
      } else {
        this.editFeatureForm.addControl(key, new FormControl(currentValue));
        this.editFeatureData.push({
          name: key,
          property: {
            name: key,
            title: key,
            valueType: 'STRING'
          },
          value: currentValue
        });

        this.logger.info('Свойство: ' + key + ' отсутствует в описании типа по приказу');
      }
    }
  }

  /**
   * Ищем свойство, среди тех что есть в XSD схеме.
   *
   * @param key Наименование свойства, полученное из "фичи" геосервера
   * @param properties Свойства полученные из XSD схемы.
   */
  private getPropertiesByName(key: string, properties: SimpleProperty[]) {
    return properties.find((simpleProperty: SimpleProperty) => {
      return simpleProperty.name === key.toUpperCase();
    });
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

  close() {
    this.closeMe.emit(true);
  }

}

interface EditFeatureItem {
  name: string;
  value: string;
  property: SimpleProperty;
}
