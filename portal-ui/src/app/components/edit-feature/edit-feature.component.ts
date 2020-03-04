import { Component, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { from } from 'rxjs';
import { concatMap, takeUntil, filter } from 'rxjs/operators';
import { ModifyEvent } from 'ol/interaction/Modify';
import GeometryType from 'ol/geom/GeometryType';
import { Coordinate } from 'ol/coordinate';
import { cloneDeep } from 'lodash';

import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ProjectsService } from '../../services/crg/projects.service';
import { CommunicationService } from '../../services/communication.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { TransformFeatureService } from '../../services/geoserver/transform-feature.service';
import { ActionType, SideBarManager, SidebarType } from '../../services/side-bar-manager.service';
import { dataSchemaService, PropertySchema } from '../../services/crg/data-schema.service';
import { FeaturePropertyValidators, ValueType } from '../../services/util/FeaturePropertyValidators';
import { BaseEdit } from '../edit-bug-object/base-edit';
import { FeatureUtil } from '../../services/util/FeatureUtil';
import { Toast } from '../Toast/Toast';
import { BatchModel } from '../../services/crg/batch-model';
import { WfsFeature, WfsGeometry } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { fromMobx } from '../../services/util/fromMobx';
import { ValueTitleProjection } from '../../services/geoserver/projections';

export interface EditFeatureData {
  feature: WfsFeature;   // Шаблонная фича
  mode: EditFeatureMode;
  featuresId?: string[]; // Идентификаторы фич (заполняется в режиме множественного редактирования)
  total?: number;
  properties?: {};
  isNew?: true;
}

interface Properties { [key: string]: any; }

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent extends BaseEdit implements OnChanges, OnInit, OnDestroy {
  @Input() data: EditFeatureData;
  @Output() closeMe = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<string>();

  isAttributeSidebarOpened = false;
  isSaveInProgress = false;
  loadPercent = 0;
  changedGeometry?: WfsGeometry;
  isGeometryValid = false;
  isGeometryChanged = false;
  editGeometryStore = new EditFeatureGeometryStore();

  get readOnly (): boolean {
    return this.featureDescription.readOnly;
  }

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private projectsService: ProjectsService,
              private communicationService: CommunicationService,
              private sideBarManager: SideBarManager,
              private transformFeatureService: TransformFeatureService) {
    super();

    this.modifyHandler = this.modifyHandler.bind(this);
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

    fromMobx(() => this.editGeometryStore.resultGeometry)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(changedGeometry => {
          this.changedGeometry = changedGeometry;

          if (this.editGeometryStore.isValid) {
            const feature = {
              ...this.data.feature,
              geometry: changedGeometry
            };
            openLayersService.clearDraft();
            openLayersService.paintFeature(feature);
            openLayersService.showFeature(feature);
          }
        });

    fromMobx(() => this.editGeometryStore.isValid)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(isValid => {
          this.isGeometryValid = isValid;
        });

    fromMobx(() => this.editGeometryStore.isChanged)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(isChanged => {
          this.isGeometryChanged = isChanged;
        });

    openLayersService.enableDraftModification(this.modifyHandler);
  }

  ngOnDestroy () {
    openLayersService.disableDraftModification(this.modifyHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.editGeometryStore.initGeometry(this.data.feature.geometry);

    const dataChanged = changes.data;
    if (dataChanged) {
      this.editFeatureData = [];
      const currentData: EditFeatureData = dataChanged.currentValue;

      if (currentData.mode === EditFeatureMode.single) {
        if (!this.data.isNew) {
          openLayersService.showFeature(currentData.feature);
        }
        this.isGeometryChanged = false;
      }

      this.featureDescription = dataSchemaService.getFeatureSchemaByName(currentData.feature.id.split('.')[0]);
      this.editFeatureForm = this.formBuilder.group({});

      Object.keys(currentData.feature.properties)
            .filter(key => key !== 'bbox')
            .forEach(key => {
              const currentValue = currentData.feature.properties[key];

              let property: PropertySchema;
              if (this.featureDescription) {
                property = dataSchemaService.getPropertySchemaByName(key, this.featureDescription.properties);
              }

              if (property) {
                this.editFeatureData.push({
                  name: key,
                  property: property,
                  value: currentValue,
                  isFgistpProperty: true
                });

                const formControl = new FormControl(
                  {
                    value: currentValue,
                    disabled: property.name === 'GLOBALID'
                  },
                  {
                    validators: [
                      FeaturePropertyValidators.validate(property),
                    ],
                    // updateOn: 'blur'
                  }
                );

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

      this.data = currentData;

      setTimeout(() => {
        this.validateCustomRules(currentData.feature.properties);
      }, 22);
    }
  }

  async editFeature () {
    if (this.editFeatureForm.pristine && !this.isGeometryChanged || !this.isGeometryValid) {
      return;
    }

    this.isSaveInProgress = true;

    if (this.data && this.data.feature && this.data.feature.properties) {
      const propCopy = { ...this.data.feature.properties };
      const newProperties = this.getActualValuesFromForm(propCopy);

      if (this.data.mode === EditFeatureMode.single) {
        const calcAttributes = FeatureUtil.calculateByFunction(propCopy, this.featureDescription.calcFiledFunction);
        Object.keys(calcAttributes).forEach(key => {
          newProperties[key] = calcAttributes[key];
        });

        if (this.data.isNew) {
          this.transformFeatureService.insertFeatures(
              [{ ...this.data.feature, properties: newProperties, geometry: this.changedGeometry }],
              (await this.projectsService.getCurrent()).internalName,
              this.featureDescription.tableName
          ).subscribe(() => {
            this.close();
          });
        } else {
          this.batchUpdateFeatures(
              [this.data.feature.id],
              newProperties,
              this.isGeometryChanged ? this.changedGeometry : undefined
          );
        }
      } else {
        this.batchUpdateFeatures(this.data.featuresId, newProperties);
      }
    }
  }

  async deleteFeature () {
    const data: ConfirmDialogData = {
      title: 'Удалить объект?',
      approveBtnName: 'Удалить'
    };
    const { feature } = this.data;
    const [layerName, newId] = feature.id.split('.');
    const { internalName } = await this.projectsService.getCurrent();

    this.dialog
        .open(ConfirmDialogComponent, { width: '400px', data: data })
        .afterClosed().pipe(filter(value => !!value))
        .subscribe(() => {
          this.transformFeatureService.deleteFeatures(
            [{ ...feature, id: newId }],
            internalName,
            layerName
          ).subscribe(() => {
            this.delete.emit(feature.id);
            this.close();
            openLayersService.refreshLayer(`${internalName}:${layerName}`);
          });
        });
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

    openLayersService.clearDraft();

    if (this.data.isNew) {
      this.sideBarManager.do({
        target: SidebarType.FEATURES,
        action: ActionType.CLOSE
      });
    }
  }

  getEnumerationTitle (enumerations: ValueTitleProjection[], value: string | number): string {
    const item = enumerations.find(item => String(item.value) === String(value));
    return item && item.title;
  }

  private async batchUpdateFeatures(featuresId: string[], newProperties: Properties, geometry?: WfsGeometry) {
    const { internalName } = await this.projectsService.getCurrent();
    const { tableName } = this.featureDescription;

    const batchModel = new BatchModel(featuresId);

    let i = 0;
    from(batchModel.batches)
      .pipe(
        concatMap(features => this.transformFeatureService
                                      .updateFeatures(features, internalName, tableName, newProperties, geometry)),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        i++;
        const percent = Math.ceil(batchModel.percentOfOneBatch * i);
        if (i >= batchModel.totalBatches) {
          this.loadPercent = percent > 100 ? 100 : percent;
          this.isSaveInProgress = false;
          this.closeMe.emit(true);
          openLayersService.refreshLayer(`${internalName}:${tableName}`);
          openLayersService.clearDraft();

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

  private modifyHandler (e: ModifyEvent) {
    const geometry = e.features.item(0).getGeometry();

    // @ts-ignore
    let coordinates = geometry.getCoordinates();

    this.editGeometryStore.setGeometry({
      ...this.editGeometryStore.geometry,
      coordinates
    });
  }
}
