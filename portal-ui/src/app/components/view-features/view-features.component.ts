import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Pageable } from '../../services/crg/models';
import { WfsFeature } from '../../services/geoserver/wfs-models';
import { DataSchemaService } from '../../services/crg/data-schema.service';
import { OpenLayersService } from '../../services/open-layer/open-layers.service';
import { EditFeatureData, EditFeatureMode } from '../edit-feature/edit-feature.component';
import { ActionType, SideBarManager, SidebarType } from '../../services/side-bar-manager.service';
import { getEnvironment } from '../../services/environment';
import {CrgLayer} from '../../stores/ProjectsList.store';

export interface ViewFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  layer?: CrgLayer;
  isNew?: true;
}

@Component({
  selector: 'crg-view-features',
  templateUrl: './view-features.component.html',
  styleUrls: ['./view-features.component.css']
})
export class ViewFeaturesComponent implements OnChanges, OnInit, OnDestroy {

  @Input() data: ViewFeaturesData;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  deletedFeaturesIds: string[] = [];
  isEditMode = false;
  isSingleEdit = true;
  isAttributeSidebarOpened = false;
  editFeatureData: EditFeatureData;
  isSimf = false;

  viewFeatures: WfsFeature[] = [];
  pageInfo: Pageable = {
    pageSize: 25,
  };

  private featureTitles: Map<string, string> = new Map<string, string>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private sideBarManager: SideBarManager,
              private dataSchemaService: DataSchemaService,
              private openLayers: OpenLayersService) {
    this.getEnv();
  }

  ngOnInit(): void {
    this.showFeatures();

    this.fillTitles(this.viewFeatures);

    if (this.data.mode === EditFeatureMode.multipleEdit) {
      this.editFeatureData = this.prepareDataForMultipleEdit(this.data.features);
      this.isEditMode = true;
    } else {
      if (this.data.features.length === 1) {
        this.selectFeature(this.data.features[0]);
      }
    }

    this.sideBarManager.currentState$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(sidebarsState => {
          const attrSidebarState = sidebarsState[SidebarType.ATTRIBUTES];
          if (attrSidebarState === ActionType.OPEN) {
            this.isAttributeSidebarOpened = true;
          } else {
            this.isAttributeSidebarOpened = false;
          }
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];
    if (dataChanged && !dataChanged.isFirstChange()) {
      const currentValue = dataChanged.currentValue as ViewFeaturesData;
      if (currentValue && currentValue.features && currentValue.features.length === 1) {
        this.selectFeature(currentValue.features[0]);
      } else if (currentValue && currentValue.features && currentValue.features.length > 1) {
        this.showFeatures();

        this.fillTitles(this.viewFeatures);

        if (currentValue.mode === EditFeatureMode.multipleEdit) {
          this.editFeatureData = this.prepareDataForMultipleEdit(currentValue.features);
          this.isEditMode = true;
        } else {
          this.isEditMode = false;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  switchMode() {
    this.isEditMode = !this.isEditMode;
  }

  selectFeature(feature: WfsFeature) {
    this.isEditMode = true;
    this.isSingleEdit = true;
    this.editFeatureData = {
      feature: feature,
      mode: EditFeatureMode.single,
      isNew: this.data.isNew
    };
  }

  highlightFeature(feature: WfsFeature) {
    this.openLayers.clearDraft();
    this.openLayers.paintFeature(feature);
  }

  closeMe() {
    this.openLayers.clearDraft();
    this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.CLOSE});
  }

  deleteHandler (id: string) {
    this.deletedFeaturesIds.push(id);
    this.showFeatures();
    if (this.data.features.length === this.deletedFeaturesIds.length) {
      this.closeMe();
    }
  }

  editFeatures() {
    if (this.data.features.length === 1) {
      this.selectFeature(this.data.features[0]);
    } else {
      this.editFeatureData = this.prepareDataForMultipleEdit(this.data.features);
      this.isEditMode = true;
    }
  }

  onPaging(event: { pageIndex: number }) {
    const start = this.pageInfo.pageSize * event.pageIndex;
    this.viewFeatures = this.data.features.slice(start, start + this.pageInfo.pageSize);

    this.fillTitles(this.viewFeatures);
  }

  getTitle(feature: WfsFeature): string {
    return this.featureTitles.get(feature.id);
  }

  private showFeatures(page: number = 0) {
    const start = this.pageInfo.pageSize * page;
    this.viewFeatures = this.data.features
                                 .filter(feature => !this.deletedFeaturesIds.includes(feature.id))
                                 .slice(start, start + this.pageInfo.pageSize);
  }

  private async getEnv () {
    const environment = await getEnvironment();
    this.isSimf = environment.platform === 'simf';
  }

  private prepareDataForMultipleEdit(features: WfsFeature[]): EditFeatureData {
    const templateFeature: WfsFeature = features[0];
    const listOfFeaturesId = features.map((feature: WfsFeature) => feature.id);

    return {
      feature: templateFeature,
      mode: EditFeatureMode.multipleEdit,
      featuresId: listOfFeaturesId,
      total: features.length
    } as EditFeatureData;
  }

  private fillTitles(viewFeatures: WfsFeature[]) {
    viewFeatures.forEach((feature: WfsFeature) => {
      const featureName = feature.id.split('.')[0];
      const { properties } = feature;

      let title = '';
      const fDescription = this.dataSchemaService.getFeatureSchemaByName(featureName);
      if (fDescription) {
        const iProperty = fDescription.properties.find(property => property.objectIdentityOnUi);
        if (!iProperty) { // By default from 'name'
          title = properties.name;
        } else if (iProperty.valueType !== 'CHOICE') {
          title = properties[iProperty.name.toLowerCase()];
        } else if (iProperty.valueType === 'CHOICE' && iProperty.enumerations) {
          const valueTitleProjection = iProperty.enumerations.find(item => item.value == properties[iProperty.name]);

          title = valueTitleProjection ? valueTitleProjection.title : '';
        }
      }

      this.featureTitles.set(feature.id, title);
    });
  }
}
