import {NGXLogger} from 'ngx-logger';
import {Subject, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {WfsUtil} from '../../../services/open-layer/WfsUtil';
import {FizLogger} from '../../../services/logger/fiz.logger';
import {catchError, filter, takeUntil, tap} from 'rxjs/operators';
import {CrgProject} from '../../../services/gis/projects.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {CommunicationService} from '../../../services/communication.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FgistpRulesService} from '../../../services/gis/fgistp-rules.service';
import {OpenLayersService} from '../../../services/open-layer/open-layers.service';
import {CrgLayer, LayersService} from '../../../services/geoserver/layers.service';
import {GmlDialogData} from '../../../components/export/export-dilog/export-dialog.component';
import {ActionType, SidebarData, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';
import {GeoserverJSONException, WfsFeatureCollection, WfsService} from '../../../services/geoserver/wfs.service';
import {ValidationDialogData} from '../../../components/validation/validation-dialog/validation-dialog.component';

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
  selectedFeatures: any;

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
    this.ruleService.getRules().subscribe();

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
          filter((data: SidebarData) => data.target === SidebarType.BUG_REPORT ||
            data.target === SidebarType.FEATURES),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((data: SidebarData) => {
          if (data.target === SidebarType.BUG_REPORT) {
            switch (data.action) {
              case ActionType.CLOSE:  this.isBugReportSidebarActive = false; break;
              case ActionType.OPEN:   this.isBugReportSidebarActive = true;  break;
              case ActionType.SWITCH: this.isBugReportSidebarActive = !this.isBugReportSidebarActive; break;
              default:
                this.logger.warn('Unsupported action type: ', data.action);
            }
          } else if (data.target === SidebarType.FEATURES) {
            switch (data.action) {
              case ActionType.CLOSE:  this.isFeaturesSidebarActive = false; break;
              case ActionType.OPEN:   this.isFeaturesSidebarActive = true;  break;
              case ActionType.SWITCH: this.isFeaturesSidebarActive = !this.isFeaturesSidebarActive; break;
              default:
                this.logger.warn('Unsupported action type: ', data.action);
            }
          }
        });

    this.openLayers.mapClick$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((coordinate: [number, number]) => this.showFeaturesInfo(coordinate));
  }

  /**
   * Отобразить информацию об обьектах, которые пересекают заданные координаты.
   */
  private showFeaturesInfo(coordinate: [number, number]) {
    // Из видимых слоев достанем название источника
    const visibleLayersComplexName = this.openLayers.getVisibleLayers().map(vrLayer => {
      const source = vrLayer.getSource();
      if (source && source.params_ && source.params_['LAYERS']) {
        return source.params_['LAYERS'];
      } else {
        // this.logger.warn('Unexpected source: ', source);
      }
    }).filter(value => !!value);

    if (visibleLayersComplexName.length > 0) {
      const buffer = this.openLayers.getBufferByCoordinates(coordinate);

      // Формируем xml для запроса к WFS
      const xml = WfsUtil.makeXmlPolygonIntersect(visibleLayersComplexName, buffer);

      // this.openLayers.drawPolygon(buffer.getCoordinates());

      this.wfsService.getFeaturesByFilter(xml)
          .subscribe((featureCollection: WfsFeatureCollection) => {
            this.openLayers.clearDraft();
            if (featureCollection.features && featureCollection.features.length > 0) {
              this.selectedFeatures = featureCollection.features;
              this.sideBarManager.do(SidebarType.FEATURES, ActionType.OPEN);

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
