import { reaction, IReactionDisposer } from 'mobx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { Coordinate } from 'ol/coordinate';

import { cn } from '../../services/util/cn';
import { CrgLayer } from '../../services/crg/projects.models';
import { makeXmlPolygonIntersect } from '../../services/open-layer/WfsUtil';
import { ValidationDialogData } from '../../components/validation/validation-dialog/validation-dialog.component';
import { GmlDialogData } from '../../components/export/export-dilog/export-dialog.component';
import { ViewFeaturesData } from '../../components/view-features/view-features.component';
import { communicationService } from '../../services/communication.service';
import { EditFeatureMode } from '../../components/edit-feature/edit-feature.component';

import { openLayersService } from '../../services/open-layer/open-layers.service';
import { deleteLayer } from '../../services/geoserver/layers.service';
import { FeatureTypesService } from '../../services/geoserver/featuretypes.service';
import { getFeaturesByXmlFilter } from '../../services/geoserver/wfs.service';
import { sideBarManager, ActionType, Sidebar, SidebarType } from '../../services/side-bar-manager.service';
import { Toast } from '../Toast/Toast';
import { baseMapsService } from '../../services/crg/base-maps.service';
import { currentProject } from '../../stores/CurrentProject.store';

type NamesChunks = { [srsName: string]: string[] };

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  isAttrSidebarActive = false;
  isBugReportSidebarActive = false;
  isValidationDialogShow = false;
  isGmlDialogShow = false;
  isFeaturesSidebarActive = false;

  viewFeaturesData: ViewFeaturesData;
  validationDialogData: ValidationDialogData;
  selectedLayer: CrgLayer;
  cn = cn('map');

  private reactionDisposer: IReactionDisposer;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private featureTypesService: FeatureTypesService) {
  }

  async ngOnInit() {
    await baseMapsService.fetchAll(currentProject.baseMaps);

    openLayersService.createMap();

    // Позиционируемся по BBOX проекта
    if (currentProject.bbox) {
      openLayersService.fitToBbox(JSON.parse(currentProject.bbox), [0, 0, 0, 0]);
    }

    this.reactionDisposer = reaction(() => currentProject.visibleLayers, visibleItems => {
      openLayersService.showItems(visibleItems);
    }, { fireImmediately: true });

    communicationService.validationDialog
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: ValidationDialogData) => {
          if (data && data.show) {
            this.isValidationDialogShow = true;

            if (data.layers && data.layers.length > 0) {
              this.validationDialogData = data;
            } else {
              Toast.warn('Отсутствуют данные. Начните свою работу с загрузки слоев.');
            }
          } else {
            this.isValidationDialogShow = false;
          }
        });

    communicationService.gmlDialog
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: GmlDialogData) => this.isGmlDialogShow = data.action !== ActionType.CLOSE);

    communicationService.sidebarManager
        .pipe(
          filter((data: Sidebar) => this.isMapSidebar(data)),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((sidebar: Sidebar) => {
          if (sidebar.target === SidebarType.BUG_REPORT) {
            switch (sidebar.action) {
              case ActionType.CLOSE:
                this.isBugReportSidebarActive = false;
                break;
              case ActionType.OPEN:
                this.isBugReportSidebarActive = true;
                break;
              case ActionType.SWITCH:
                this.isBugReportSidebarActive = !this.isBugReportSidebarActive;
                break;
            }
          } else if (sidebar.target === SidebarType.FEATURES) {
            this.viewFeaturesData = sidebar.data;

            switch (sidebar.action) {
              case ActionType.CLOSE:
                this.isFeaturesSidebarActive = false;
                break;
              case ActionType.OPEN:
                this.isFeaturesSidebarActive = true;
                break;
              case ActionType.SWITCH:
                this.isFeaturesSidebarActive = !this.isFeaturesSidebarActive;
                break;
            }
          } else if (sidebar.target === SidebarType.ATTRIBUTES) {
            this.selectedLayer = sidebar.data;

            switch (sidebar.action) {
              case ActionType.CLOSE:
                this.isAttrSidebarActive = false;
                break;
              case ActionType.OPEN:
                this.isAttrSidebarActive = true;
                break;
              case ActionType.SWITCH:
                this.isAttrSidebarActive = !this.isAttrSidebarActive;
                break;
            }
          }
        });

    openLayersService.mapClick$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((coordinate: [number, number]) => this.showFeaturesInfo(coordinate));
  }

  ngOnDestroy(): void {
    this.reactionDisposer();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async deleteLayer(layer: CrgLayer) {
    await deleteLayer(layer);
    const fType: FeatureType = await this.featureTypesService.getByName(layer);
    await this.featureTypesService.delete(fType);
    Toast.info('Удалено');

    await openLayersService.deleteLayerFromMap(layer.complexName);
  }

  /**
   * Отобразить информацию об объектах, которые пересекают заданные координаты.
   */
  private async showFeaturesInfo(coordinate: Coordinate) {
    const visibleLayers = currentProject.visibleLayers.flat().map(({ payload }) => payload);

    if (!visibleLayers.length) {
      this.logger.debug('No visible layers');
      return;
    }

    const visibleLayersComplexNames: NamesChunks = visibleLayers.reduce((acc: NamesChunks, layer) => {
      const { nativeCRS, complexName } = layer;
      
      if (!acc[nativeCRS]) {
        acc[nativeCRS] = [];
      }
      
      acc[nativeCRS].push(complexName);
      
      return acc;
    }, {});

    const buffer = openLayersService.getBufferByCoordinates(coordinate);

    openLayersService.showSelectionMarker(buffer.getCoordinates());

    const collections = await Promise.all(Object.entries(visibleLayersComplexNames).map(([srsName, complexNames]) => {
      const xml = makeXmlPolygonIntersect(complexNames, buffer, srsName);

      return getFeaturesByXmlFilter(xml);
    }));

    const features = collections.map(({ features }) => features || []).flat();

    if (features.length) {
      sideBarManager.do({
        target: SidebarType.FEATURES,
        action: ActionType.CLOSE
      });

      setTimeout(() => {
        sideBarManager.do({
          target: SidebarType.FEATURES,
          action: ActionType.OPEN,
          data: {
            features: features,
            mode: EditFeatureMode.single
          } as ViewFeaturesData
        });
      }, 0);

      openLayersService.highlightFeature(features);
    }
  }

  private isMapSidebar(sidebar: Sidebar) {
    return sidebar.target === SidebarType.BUG_REPORT ||
      sidebar.target === SidebarType.FEATURES ||
      sidebar.target === SidebarType.ATTRIBUTES;
  }
}
