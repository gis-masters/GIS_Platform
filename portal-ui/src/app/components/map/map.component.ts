import { reaction, IReactionDisposer } from 'mobx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { Coordinate } from 'ol/coordinate';
import '!style-loader!css-loader!sass-loader!ol/ol.css';

import { cn } from '../../services/util/cn';
import { CrgLayer, CrgLayerType } from '../../services/crg/projects.models';
import { ValidationDialogData } from '../../components/validation/validation-dialog/validation-dialog.component';
import { GmlDialogData, ActionType } from '../../components/export/export-dilog/export-dialog.component';
import { getFeatureTypeByLayer, deleteFeatureType } from '../../services/geoserver/featuretypes.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { getFeaturesByXmlFilter } from '../../services/geoserver/wfs.service';
import { communicationService } from '../../services/communication.service';
import { makeXmlPolygonIntersect } from '../../services/open-layer/WfsUtil';
import { EditFeatureMode } from '../edit-feature/edit-feature.component';
import { fetchAllBaseMaps } from '../../services/crg/base-maps.service';
import { deleteLayer } from '../../services/geoserver/layers.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { fromMobx } from '../../services/util/fromMobx';
import { Emitter } from '../../services/util/Emitter';
import { sidebars } from '../../stores/Sidebars.store';
import { Toast } from '../Toast/Toast';

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
  isEditSidebarActive = false;

  validationDialogData: ValidationDialogData;
  selectedLayer: CrgLayer;
  cn = cn('map');

  private reactionDisposer: IReactionDisposer;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {}

  async ngOnInit() {
    await fetchAllBaseMaps(currentProject.baseMaps);

    openLayersService.createMap();

    // Позиционируемся по BBOX проекта
    if (currentProject.bbox) {
      openLayersService.fitToBbox(JSON.parse(currentProject.bbox), [0, 0, 0, 0]);
    }

    this.reactionDisposer = reaction(
      () => currentProject.visibleLayersBatched,
      visibleBatches => {
        openLayersService.hideUserLayers();

        visibleBatches.forEach((batch, i) => {
          const { actualTransparency } = batch[0];

          const layers = batch.map(item => item.payload).reverse();

          openLayersService.addLayers(
            layers.filter(l => l.type !== CrgLayerType.EXTERNAL),
            visibleBatches.length - i,
            actualTransparency / 100
          );

          openLayersService.addExternalLayers(
            layers.filter(l => l.type === CrgLayerType.EXTERNAL),
            visibleBatches.length - i
          );
        });
      },
      { fireImmediately: true }
    );

    communicationService.validationDialog.pipe(takeUntil(this.unsubscribe$)).subscribe((data: ValidationDialogData) => {
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

    communicationService.gmlDialog.pipe(takeUntil(this.unsubscribe$)).subscribe((data: GmlDialogData) => {
      this.isGmlDialogShow = data.action !== ActionType.CLOSE;
    });

    fromMobx(() => sidebars.leftOpen)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.attributesOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(attributesOpen => {
        this.isAttrSidebarActive = attributesOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.featuresOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(featuresOpen => {
        this.isFeaturesSidebarActive = featuresOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.editOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(editOpen => {
        this.isEditSidebarActive = editOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.bugReportOpen, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(bugReportOpen => {
        this.isBugReportSidebarActive = bugReportOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    openLayersService.mapClick.on(coordinate => this.showFeaturesInfo(coordinate), this);
    openLayersService.zoomChanged.on(value => currentProject.changeZoom(value), this);
  }

  ngOnDestroy(): void {
    openLayersService.destroyMap();
    this.reactionDisposer();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    Emitter.scopeOff(this);
  }

  async deleteLayer(layer: CrgLayer) {
    await deleteLayer(layer);
    const fType: FeatureType = await getFeatureTypeByLayer(layer);
    await deleteFeatureType(fType);
    Toast.info('Удалено');

    await openLayersService.deleteLayerFromMap(layer.complexName);
  }

  /**
   * Отобразить информацию об объектах, которые пересекают заданные координаты.
   */
  private async showFeaturesInfo(coordinate: Coordinate) {
    const visibleLayers = currentProject.visibleLayersWithoutRasters.map(({ payload }) => payload);

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

    const collections = await Promise.all(
      Object.entries(visibleLayersComplexNames).map(([srsName, complexNames]) => {
        const xml = makeXmlPolygonIntersect(complexNames, buffer, srsName);

        return getFeaturesByXmlFilter(xml);
      })
    );

    const features = collections.map(({ features }) => features || []).flat();

    if (features.length) {
      if (features.length > 1) {
        sidebars.openFeatures(features);
      } else {
        sidebars.openEdit({
          features,
          mode: EditFeatureMode.single
        });
      }
    }
  }
}
