import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { EditFeatureData, EditFeatureMode } from '../edit-feature/edit-feature.component';
import { sideBarManager, ActionType, SidebarType } from '../../services/side-bar-manager.service';
import { CrgLayer } from '../../services/crg/projects.models';
import { communicationService } from '../../services/communication.service';

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
  hasEditable: boolean;
  viewFeatures: WfsFeature[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.showFeatures();

    if (this.data.mode === EditFeatureMode.multipleEdit) {
      this.editFeatureData = this.prepareDataForMultipleEdit(this.data.features);
      this.isEditMode = true;
    } else {
      if (this.data.features.length === 1) {
        this.selectFeature(this.data.features[0]);
      }
    }

    sideBarManager.currentState$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(sidebarsState => {
          const attrSidebarState = sidebarsState[SidebarType.ATTRIBUTES];
          if (attrSidebarState === ActionType.OPEN) {
            this.isAttributeSidebarOpened = true;
          } else {
            this.isAttributeSidebarOpened = false;
          }
        });

    communicationService.featuresUpdate$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.closeMe();
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes.data;
    if (dataChanged && !dataChanged.isFirstChange()) {
      const currentValue = dataChanged.currentValue as ViewFeaturesData;
      if (currentValue && currentValue.features && currentValue.features.length === 1) {
        this.selectFeature(currentValue.features[0]);
      } else if (currentValue && currentValue.features && currentValue.features.length > 1) {
        this.showFeatures();

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

  closeMe() {
    openLayersService.clearDraft();
    sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.CLOSE});
  }

  deleteHandler (id: string) {
    this.deletedFeaturesIds.push(id);
    this.showFeatures();
    if (this.data.features.length === this.deletedFeaturesIds.length) {
      this.closeMe();
    }
  }

  private showFeatures() {
    this.viewFeatures = this.data.features.filter(feature => !this.deletedFeaturesIds.includes(feature.id));
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
}
