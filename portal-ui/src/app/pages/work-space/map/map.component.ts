import {NGXLogger} from 'ngx-logger';
import {Subject, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {WfsUtil} from '../../../services/open-layer/WfsUtil';
import {FizLogger} from '../../../services/logger/fiz.logger';
import {catchError, filter, takeUntil, tap} from 'rxjs/operators';
import {CrgProject} from '../../../services/crg/projects.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {CommunicationService} from '../../../services/communication.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {GmlDialogData} from '../../../components/export/export-dilog/export-dialog.component';
import {ActionType, Sidebar, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';
import {FeatureXsdDefinition, FgistpRulesService, XsdFeature} from '../../../services/crg/fgistp-rules.service';
import {GeoserverJSONException, WfsFeatureCollection, WfsService} from '../../../services/geoserver/wfs.service';
import {ValidationDialogData} from '../../../components/validation/validation-dialog/validation-dialog.component';
import {ViewFeaturesData} from '../../../components/view-features/view-features.component';
import {EditFeatureMode} from '../../../components/edit-feature/edit-feature.component';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  currentProject: CrgProject;

  layers: CrgLayer[] = undefined;

  isLayersSidebarActive = false;
  isBugReportSidebarActive = false;

  isFeaturesSidebarActive = false;
  viewFeaturesData: ViewFeaturesData;

  isAttrSidebarActive = false;
  selectedLayer;

  isValidationDialogShow = false;
  validationDialogData: ValidationDialogData;
  isGmlDialogShow = false;

  gmlDialogData: CrgLayer[];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private layersService: LayersService,
              private logger: NGXLogger,
              private log: FizLogger,
              private snackBar: MatSnackBar,
              private wfsService: WfsService,
              private ruleService: FgistpRulesService,
              private storageService: LocalStorageService,
              private sideBarManager: SideBarManager,
              private communicationService: CommunicationService,
              private openLayers: OpenLayersService) {
    this.log.debug('mapComponent', 'debug test');
    this.log.info('mapComponent', 'info test');
    this.log.warn('mapComponent', 'warn test');
    this.log.error('mapComponent', 'error test');

    this.communicationService.stepperEvents.emit(3);
  }

  ngOnInit() {
    this.openLayers.createMap();
    this.ruleService.getRules()
        .subscribe((entityTypesDefinition: FeatureXsdDefinition) => {
          if (!entityTypesDefinition.xsdFeatures) {
            this.logger.warn('Empty rules? ', entityTypesDefinition);
          }
        });

    this.currentProject = this.storageService.getProject().crgProject;
    this.layersService.fetchLayers(this.currentProject)
        .pipe(
          tap(layers => this.layers = layers),
          catchError(err => {
            this.logger.error('layers-sidebar layers error', err);
            return throwError(err);
          })
        ).subscribe((layers: CrgLayer[]) => {
          layers.forEach((layer, index) => {
            this.openLayers
                .addLayerToMap(layer.complexName)
                .setZIndex(layers.length - index);
          });

          // Позиционируемся на первом из загруженных слоев
          if (layers.length > 0) {
            this.wfsService.getFeatures(layers[0].complexName)
                .subscribe((fCollection: WfsFeatureCollection) => {
                  if (fCollection && fCollection.bbox) {
                    this.openLayers.fitToBbox(fCollection.bbox, [50, 50, 50, 50]);
                  } else {
                    this.logger.info('Cant position to layer', fCollection);
                  }
                });
          }
        });

    this.communicationService.validationDialog
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data: ValidationDialogData) => {
          if (data && data.show) {
            this.isValidationDialogShow = true;

            if (data.layers && data.layers.length > 0) {
              this.validationDialogData = data;
            } else {
              this.logger.warn('Empty data: ', data);
              this.snackBar.open('Отсутствуют данные. Начните свою работу с загрузки слоев.', 'X',
                {duration: 10000});
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
              case ActionType.CLOSE:  this.isBugReportSidebarActive = false;    break;
              case ActionType.OPEN:   this.isBugReportSidebarActive = true;     break;
              case ActionType.SWITCH: this.isBugReportSidebarActive = !this.isBugReportSidebarActive; break;
              default:
                this.logger.warn('Unsupported action type: ', sidebar.action);
            }
          } else if (sidebar.target === SidebarType.FEATURES) {
            this.viewFeaturesData = sidebar.data;

            switch (sidebar.action) {
              case ActionType.CLOSE:  this.isFeaturesSidebarActive = false;    break;
              case ActionType.OPEN:   this.isFeaturesSidebarActive = true;     break;
              case ActionType.SWITCH: this.isFeaturesSidebarActive = !this.isFeaturesSidebarActive; break;
              default:
                this.logger.warn('Unsupported action type: ', sidebar.action);
            }
          } else if (sidebar.target === SidebarType.ATTRIBUTES) {
            this.selectedLayer = sidebar.data;

            switch (sidebar.action) {
              case ActionType.CLOSE:  this.isAttrSidebarActive = false;    break;
              case ActionType.OPEN:   this.isAttrSidebarActive = true;     break;
              case ActionType.SWITCH: this.isAttrSidebarActive = !this.isAttrSidebarActive; break;
              default:
                this.logger.warn('Unsupported action type: ', sidebar.action);
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

  /**
   * Отобразить информацию об обьектах, которые пересекают заданные координаты.
   */
  private showFeaturesInfo(coordinate: [number, number]) {
    const visibleLayersComplexName = this.getComplexNamesOfVisibleLayers();

    if (visibleLayersComplexName.length > 0) {
      const buffer = this.openLayers.getBufferByCoordinates(coordinate);

      // Формируем xml для запроса к WFS
      const xml = WfsUtil.makeXmlPolygonIntersect(visibleLayersComplexName, buffer);

      this.openLayers.drawPolygon(buffer.getCoordinates());

      this.wfsService.getFeaturesByXmlFilter(xml)
          .subscribe((featureCollection: WfsFeatureCollection) => {
            this.openLayers.clearDraft();

            if (featureCollection.features && featureCollection.features.length > 0) {
              this.sideBarManager.do({target: SidebarType.FEATURES, action: ActionType.OPEN,
                data: {
                  features: featureCollection.features,
                  mode: EditFeatureMode.single
                } as ViewFeaturesData
              });

              featureCollection.features.forEach(feature => {
                this.openLayers.paintFeature(feature);
              });
            } else {
              this.logger.info('No features selected');
            }
          }, (exception: GeoserverJSONException) => {
            this.logger.error('errorResponse: ', exception);
          });
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
}
