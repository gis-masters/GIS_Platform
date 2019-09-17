import {NGXLogger} from 'ngx-logger';
import { MatPaginator } from '@angular/material/paginator';
import {Pageable} from '../../services/crg/models';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {DataSchemaService} from '../../services/crg/data-schema.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {EditFeatureData, EditFeatureMode} from '../edit-feature/edit-feature.component';
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'crg-view-features',
  templateUrl: './view-features.component.html',
  styleUrls: ['./view-features.component.css']
})
export class ViewFeaturesComponent implements OnChanges, OnInit, OnDestroy {

  @Input() data: ViewFeaturesData;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  isEditMode = false;
  isSingleEdit = true;
  isAttributeSidebarOpened = false;
  editFeatureData: EditFeatureData;
  isSimf: boolean = environment.platform === 'simf';

  viewFeatures: WfsFeature[] = [];
  pageInfo: Pageable = {
    pageSize: 25,
  };

  private featureTitles: Map<string, string> = new Map<string, string>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private dataSchemaService: DataSchemaService,
              private openLayers: OpenLayersService) {
  }

  ngOnInit(): void {
    this.viewFeatures = this.data.features.slice(this.pageInfo.pageSize * this.pageInfo.count, this.pageInfo.pageSize);

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
        this.viewFeatures = this.data.features.slice(this.pageInfo.pageSize * this.pageInfo.count, this.pageInfo.pageSize);

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
    this.editFeatureData = {feature: feature, mode: EditFeatureMode.single} as EditFeatureData;
  }

  closeMe() {
    this.openLayers.clearDraft();
    this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.CLOSE});
  }

  editFeatures() {
    if (this.data.features.length === 1) {
      this.selectFeature(this.data.features[0]);
    } else {
      this.editFeatureData = this.prepareDataForMultipleEdit(this.data.features);
      this.isEditMode = true;
    }
  }

  onPaging(event) {
    const start = this.pageInfo.pageSize * event.pageIndex;
    this.viewFeatures = this.data.features.slice(start, start + this.pageInfo.pageSize);
  }

  getTitle(feature: WfsFeature): string {
    return this.featureTitles.get(feature.id);
  }

  private prepareDataForMultipleEdit(features: WfsFeature[]): EditFeatureData {
    const tamplateFeature: WfsFeature = features[0];
    const listOfFeaturesId = features.map((feature: WfsFeature) => feature.id);

    return {
      feature: tamplateFeature,
      mode: EditFeatureMode.multipleEdit,
      featuresId: listOfFeaturesId,
      total: features.length
    } as EditFeatureData;
  }

  private fillTitles(viewFeatures: WfsFeature[]) {
    viewFeatures.forEach((feature: WfsFeature) => {
      const featureName = feature.id.split('.')[0];
      const classIdAlias = this.dataSchemaService.getClassIdAlias(featureName, feature.properties);

      if (classIdAlias) {
        this.featureTitles.set(feature.id, classIdAlias);
      } else {
        const fDescription = this.dataSchemaService.getFeatureDescriptionByName(featureName);
        if (fDescription) {
          this.featureTitles.set(feature.id, fDescription.title);
        } else {
          this.featureTitles.set(feature.id, '');
        }
      }
    });
  }
}

export interface ViewFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
}
