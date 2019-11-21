import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, filter, takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { cn } from '../../services/util/cn';
import { Project } from '../../stores/ProjectsList.store';
import { WfsUtil } from '../../services/open-layer/WfsUtil';
import { ValidationDialogData } from '../../components/validation/validation-dialog/validation-dialog.component';
import { GmlDialogData } from '../../components/export/export-dilog/export-dialog.component';
import { ViewFeaturesData } from '../../components/view-features/view-features.component';
import { CommunicationService } from '../../services/communication.service';
import { EditFeatureMode } from '../../components/edit-feature/edit-feature.component';

import { OpenLayersService } from '../../services/open-layer/open-layers.service';
import { CrgLayer, LayersService } from '../../services/geoserver/layers.service';
import { FeatureTypesService } from '../../services/geoserver/featuretypes.service';
import { ProjectsService } from '../../services/crg/projects.service';
import { WfsFeatureCollection, WfsService } from '../../services/geoserver/wfs.service';
import { ActionType, Sidebar, SideBarManager, SidebarType } from '../../services/side-bar-manager.service';
import { Toast } from '../Toast/Toast';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  currentProject: Project;

  isAttrSidebarActive: boolean = false;
  isBugReportSidebarActive: boolean = false;
  isValidationDialogShow: boolean = false;
  isGmlDialogShow: boolean = false;
  isFeaturesSidebarActive: boolean = false;

  viewFeaturesData: ViewFeaturesData;
  validationDialogData: ValidationDialogData;
  layers: CrgLayer[];
  gmlDialogData: CrgLayer[];
  selectedLayer: CrgLayer;
  cn = cn('map');

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor (private logger: NGXLogger,
              private openLayers: OpenLayersService,
              private layersService: LayersService,
              private featureTypesService: FeatureTypesService,
              private projectsService: ProjectsService,
              private wfsService: WfsService,
              private communicationService: CommunicationService,
              private sideBarManager: SideBarManager) {
    this.communicationService.stepperEvents.emit(3);
  }

  ngOnInit () {
    this.openLayers.createMap();

    this.fetchLayers();

    this.communicationService.validationDialog
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

    this.communicationService.gmlDialog
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: GmlDialogData) => {
          if (data.action === ActionType.CLOSE) {
            this.isGmlDialogShow = false;
          } else {
            this.isGmlDialogShow = true;
            this.gmlDialogData = this.layers;
          }
        });

    this.communicationService.sidebarManager
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

    this.openLayers.mapClick$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((coordinate: [number, number]) => this.showFeaturesInfo(coordinate));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async deleteLayer(layer: CrgLayer) {
    await this.layersService.deleteLayer(layer);
    const fType: FeatureType = await this.featureTypesService.getByName(layer);
    await this.featureTypesService.delete(fType);
    Toast.info('Удалено');

    await this.openLayers.deleteLayerFromMap(layer.complexName);
  }

  /**
   * Отобразить информацию об объектах, которые пересекают заданные координаты.
   */
  private async showFeaturesInfo(coordinate: [number, number]) {
    const visibleLayersComplexName = this.getComplexNamesOfVisibleLayers();

    if (visibleLayersComplexName.length > 0) {
      const buffer = this.openLayers.getBufferByCoordinates(coordinate);

      // Формируем xml для запроса к WFS
      const xml = WfsUtil.makeXmlPolygonIntersect(visibleLayersComplexName, buffer);

      this.openLayers.drawPolygon(buffer.getCoordinates());

      const fCollection: WfsFeatureCollection = await this.wfsService.getFeaturesByXmlFilter(xml);

      this.openLayers.clearDraft();

      if (fCollection.features && fCollection.features.length > 0) {
        this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.OPEN,
          data: {
            features: fCollection.features,
            mode: EditFeatureMode.single
          } as ViewFeaturesData
        });

        fCollection.features.forEach(feature => {
          this.openLayers.paintFeature(feature);
        });

        this.communicationService.selectedFeatures$.emit(fCollection.features);
      }

    } else {
      this.logger.debug('No visible layers');
    }
  }

  private getComplexNamesOfVisibleLayers(): string[] {
    return this.openLayers
               .getVisibleLayers()
               .map(vrLayer => WfsUtil.getComplexLayerName(vrLayer))
               .filter(value => !!value);
  }

  private isMapSidebar(sidebar: Sidebar) {
    return  sidebar.target === SidebarType.BUG_REPORT ||
            sidebar.target === SidebarType.FEATURES ||
            sidebar.target === SidebarType.ATTRIBUTES;
  }

  private async fetchLayers() {
    this.currentProject = await this.projectsService.getCurrent();
    this.layersService.fetchLayers(this.currentProject)
        .pipe(
          tap(layers => this.layers = layers),
          catchError(err => {
            return throwError(err);
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((layers: CrgLayer[]) => {
          layers.forEach(async (layer, index) => {
            (await this.openLayers.addLayerToMap(layer.complexName)).setZIndex(layers.length - index);
          });

          // Позиционируемся на первом из загруженных слоев
          if (layers.length > 0) {
            this.wfsService.getFeatures(layers[0].complexName)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((fCollection: WfsFeatureCollection) => {
                  if (fCollection && fCollection.bbox) {
                    this.openLayers.fitToBbox(fCollection.bbox, [50, 50, 50, 50]);
                  }
                });
          }
        });
  }
}
