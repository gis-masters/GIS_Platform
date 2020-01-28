import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {ProjectsService} from '../../services/crg/projects.service';
import {CommunicationService} from '../../services/communication.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {TransformFeatureService} from '../../services/geoserver/transform-feature.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DataSchemaService, PropertySchema} from '../../services/crg/data-schema.service';
import {from} from 'rxjs';
import {concatMap, takeUntil} from 'rxjs/operators';
import {FeaturePropertyValidators, ValueType} from '../../services/util/FeaturePropertyValidators';
import {getEnvironment} from '../../services/environment';
import {BaseEdit} from '../edit-bug-object/base-edit';
import {FeatureUtil} from '../../services/util/FeatureUtil';
import {Toast} from '../Toast/Toast';
import {BatchModel} from '../../services/crg/batch-model';

export interface EditFeatureData {
  feature: WfsFeature;   // Шаблонная фича
  mode: EditFeatureMode;
  featuresId?: string[]; // Идентификаторы фич (заполняется в режиме множественного редактирования)
  total: number;
  properties?: {};
}

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent extends BaseEdit implements OnChanges, OnInit {

  @Input() data: EditFeatureData;
  @Output() closeMe = new EventEmitter<boolean>();

  isAttributeSidebarOpened = false;
  isSaveInProgress = false;
  loadPercent = 0;
  isSimf = false;

  constructor(private formBuilder: FormBuilder,
              private projectsService: ProjectsService,
              private communicationService: CommunicationService,
              private sideBarManager: SideBarManager,
              private openLayers: OpenLayersService,
              private dataSchemaService: DataSchemaService,
              private transformFeatureService: TransformFeatureService) {
    super();
    this.getEnv();
  }

  ngOnInit(): void {
    this.sideBarManager.currentState$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(sidebarsState => {
          const attrSidebarState = sidebarsState[SidebarType.ATTRIBUTES];
          this.isAttributeSidebarOpened = attrSidebarState === ActionType.OPEN;
        });

    this.editFeatureForm.valueChanges.subscribe(featureProperties => {
      this.validateCustomRules(featureProperties);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];
    if (dataChanged) {
      this.editFeatureData = [];
      const currentData: EditFeatureData = dataChanged.currentValue;

      if (currentData.mode === EditFeatureMode.single) {
        this.openLayers.showFeature(currentData.feature);
      }

      this.featureDescription = this.dataSchemaService.getFeatureSchemaByName(currentData.feature.id.split('.')[0]);
      this.editFeatureForm = this.formBuilder.group({});

      Object.keys(currentData.feature.properties)
            .map(key => key)
            .filter(key => key !== 'bbox')
            .forEach(key => {
              const currentValue = currentData.feature.properties[key];

              let property: PropertySchema;
              if (this.featureDescription) {
                property = this.dataSchemaService.getPropertySchemaByName(key, this.featureDescription.properties);
              }

              if (property) {
                this.editFeatureData.push({
                  name: key,
                  property: property,
                  value: currentValue,
                  isFgistpProperty: true
                });

                const formControl = new FormControl({value: currentValue, disabled: property.name === 'GLOBALID'}, {
                  validators: [
                    FeaturePropertyValidators.validate(property),
                  ],
                  // updateOn: 'blur'
                });

                if (this.data.mode === EditFeatureMode.multipleEdit) {
                  formControl.disable();
                }

                this.editFeatureForm.addControl(key, formControl);
              } else {
                // TODO: надобы запрашивать DescribeFeatureType по WFS и брать тип лишних атрибутов там.
                this.editFeatureData.push({
                  name: key,
                  property: {
                    name: key,
                    title: key,
                    valueType: ValueType.STRING,
                  },
                  value: currentValue,
                  isFgistpProperty: false
                });

                const formControl = new FormControl(currentValue);

                if (this.data.mode === EditFeatureMode.multipleEdit) {
                  formControl.disable();
                }

                this.editFeatureForm.addControl(key, formControl);
              }
            });

      setTimeout(() => {
        this.validateCustomRules(currentData.feature.properties);
      }, 22);
    }
  }

  async editFeature() {
    if (this.editFeatureForm.pristine) {
      return;
    }

    this.isSaveInProgress = true;

    if (this.data && this.data.feature && this.data.feature.properties) {
      const propCopy = Object.assign({}, this.data.feature.properties);
      const newProperties = this.getActualValuesFromForm(propCopy);

      if (this.data.mode === EditFeatureMode.single) {
        const calcAttributes = FeatureUtil.calculateByFunction(propCopy, this.featureDescription.calcFiledFunction);
        Object.keys(calcAttributes).forEach(key => {
          newProperties[key] = calcAttributes[key];
        });

        this.batchUpdateFeatures([this.data.feature.id], newProperties);
      } else {
        this.batchUpdateFeatures(this.data.featuresId, newProperties);
      }
    }
  }

  getTooltip() {
    const featuresCount = this.data.total;
    if (featuresCount) {
      return 'Сохранить данные для ' + this.data.total + ' объектов';
    } else {
      return 'Сохранить объект';
    }
  }

  switchControl(property: PropertySchema) {
    if (this.editFeatureForm.controls[property.name.toLowerCase()].disabled) {
      // formControl.setValue('Оставить как есть');
      this.editFeatureForm.controls[property.name.toLowerCase()].enable();
    } else {
      this.editFeatureForm.controls[property.name.toLowerCase()].disable();
    }
  }

  isShowTemplate(property: PropertySchema): boolean {
    return this.editFeatureForm.controls[property.name.toLowerCase()].disabled;
  }

  close() {
    this.closeMe.emit(true);

    this.openLayers.clearDraft();
  }

  private async getEnv () {
    const environment = await getEnvironment();
    this.isSimf = environment.platform === 'simf';
  }

  private async batchUpdateFeatures(featuresId: string[], newProperties: {}) {
    const { internalName } = await this.projectsService.getCurrent();
    const { tableName } = this.featureDescription;

    const batchModel = new BatchModel(featuresId);

    let i = 0;
    from(batchModel.batches)
      .pipe(
        concatMap(features => this.transformFeatureService
                                         .updateFeatures(features, internalName, tableName, newProperties)),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.isSaveInProgress = false;
          this.closeMe.emit(true);
          Toast.success('Сохранено');

          this.communicationService.featuresUpdate$.emit({
            feature: this.data.feature,
            featuresId: this.data.featuresId,
            total: this.data.total,
            mode: EditFeatureMode.multipleEdit,
            properties: newProperties
          });
        } else {
          this.loadPercent = percent > 100 ? 100 : percent;
        }
      });
  }

}
