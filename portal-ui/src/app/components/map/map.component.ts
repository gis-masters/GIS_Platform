import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, filter, takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { Coordinate } from 'ol/coordinate';

import { cn } from '../../services/util/cn';
import { CrgLayer, Project } from '../../stores/ProjectsList.store';
import { WfsUtil } from '../../services/open-layer/WfsUtil';
import { ValidationDialogData } from '../../components/validation/validation-dialog/validation-dialog.component';
import { GmlDialogData } from '../../components/export/export-dilog/export-dialog.component';
import { ViewFeaturesData } from '../../components/view-features/view-features.component';
import { CommunicationService } from '../../services/communication.service';
import { EditFeatureMode } from '../../components/edit-feature/edit-feature.component';

import { openLayersService } from '../../services/open-layer/open-layers.service';
import { LayersService } from '../../services/geoserver/layers.service';
import { FeatureTypesService } from '../../services/geoserver/featuretypes.service';
import { ProjectsService } from '../../services/crg/projects.service';
import { getFeaturesByXmlFilter } from '../../services/geoserver/wfs.service';
import { WfsFeatureCollection } from '../../services/geoserver/wfs-models';
import { ActionType, Sidebar, SideBarManager, SidebarType } from '../../services/side-bar-manager.service';
import { Toast } from '../Toast/Toast';
import { dataSchemaService } from '../../services/crg/data-schema.service';
import { baseMapsService } from '../../services/crg/base-maps.service';

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
  layers: CrgLayer[];
  gmlDialogData: CrgLayer[];
  selectedLayer: CrgLayer;
  cn = cn('map');

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor (private logger: NGXLogger,
              private layersService: LayersService,
              private featureTypesService: FeatureTypesService,
              private projectsService: ProjectsService,
              private communicationService: CommunicationService,
              private sideBarManager: SideBarManager) { }

  async ngOnInit() {
    const currentProject = await this.projectsService.getCurrent();

    await baseMapsService.fetchAll(currentProject.baseMaps);
    await openLayersService.createMap();
    dataSchemaService.fetchSchemas(currentProject).subscribe(value => {
      this.fetchLayers(currentProject);
    });

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

    openLayersService.mapClick$
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

    await openLayersService.deleteLayerFromMap(layer.complexName);
  }

  /**
   * Отобразить информацию об объектах, которые пересекают заданные координаты.
   */
  private async showFeaturesInfo(coordinate: Coordinate) {
    const visibleLayersComplexName = this.getComplexNamesOfVisibleLayers();

    if (visibleLayersComplexName.length) {
      const buffer = openLayersService.getBufferByCoordinates(coordinate);

      // Формируем xml для запроса к WFS
      const xml = WfsUtil.makeXmlPolygonIntersect(visibleLayersComplexName, buffer);

      openLayersService.drawPolygon(buffer.getCoordinates());

      const fCollection: WfsFeatureCollection = await getFeaturesByXmlFilter(xml);

      openLayersService.clearDraft();

      if (fCollection.features && fCollection.features.length) {
        this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.OPEN,
          data: {
            features: fCollection.features,
            mode: EditFeatureMode.single
          } as ViewFeaturesData
        });

        fCollection.features.forEach(feature => {
          openLayersService.paintFeature(feature);
        });
      }
    } else {
      this.logger.debug('No visible layers');
    }
  }

  private getComplexNamesOfVisibleLayers(): string[] {
    return openLayersService
               .getVisibleLayers()
               .map(vrLayer => WfsUtil.getComplexLayerName(vrLayer))
               .filter(value => !!value);
  }

  private isMapSidebar(sidebar: Sidebar) {
    return  sidebar.target === SidebarType.BUG_REPORT ||
            sidebar.target === SidebarType.FEATURES ||
            sidebar.target === SidebarType.ATTRIBUTES;
  }

  private async fetchLayers(currentProject: Project) {
    this.layersService.fetchLayers(currentProject)
        .pipe(
          tap(layers => this.layers = layers),
          catchError(err => {
            return throwError(err);
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((layers: CrgLayer[]) => {
          layers.forEach(async (layer, index) => {
            (await openLayersService.addLayerToMap(layer)).setZIndex(layers.length - index);
          });

          // Позиционируемся по BBOX проекта
          if (currentProject.bbox) {
            openLayersService.fitToBbox(JSON.parse(currentProject.bbox), [0, 0, 0, 0]);
          }
        });
  }
}
