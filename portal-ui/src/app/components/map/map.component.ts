import { reaction, IReactionDisposer } from 'mobx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { Coordinate } from 'ol/coordinate';
import '!style-loader!css-loader!sass-loader!ol/ol.css';

import { cn } from '../../services/util/cn';
import { CrgLayer, CrgLayerType, TreeItem } from '../../services/crg/projects.models';
import { mapService } from '../../services/map/map.service';
import { getFeaturesById, getFeaturesByXmlFilter } from '../../services/geoserver/wfs.service';
import { makeXmlPolygonIntersect } from '../../services/util/wfs.util';
import { EditFeatureMode } from '../edit-feature/edit-feature.component';
import { fetchBasemaps } from '../../services/crg/basemaps.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { fromMobx } from '../../services/util/fromMobx';
import { Emitter } from '../../services/util/Emitter';
import { sidebars } from '../../stores/Sidebars.store';
import { route } from '../../stores/Route.store';
import { services } from '../../services/services';
import { getFeatureLayer } from '../../services/geoserver/layers.service';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { printSettings } from '../../stores/PrintSettings.store';

interface NamesChunks {
  [srsName: string]: string[];
}

export const MAP_QUERY_PARAMS_DELIMITER = '~';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  isAttrSidebarActive = false;
  isBugReportSidebarActive = false;
  isFeaturesSidebarActive = false;
  isEditSidebarActive = false;

  cn = cn('map');

  private reactionDisposer: IReactionDisposer;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {}

  async ngOnInit() {
    await fetchBasemaps();

    mapService.createMap();

    const queryParams = route.queryParams as { [key: string]: string };

    if (queryParams.features) {
      let features: WfsFeature[] = [];

      const featuresInLayers: Record<string, string[]> = {};

      queryParams.features.split(',').map(feature => {
        const [featureId, workspace] = feature.split(MAP_QUERY_PARAMS_DELIMITER);

        if (!featuresInLayers[workspace]) {
          featuresInLayers[workspace] = [featureId];
        } else {
          featuresInLayers[workspace].push(featureId);
        }
      });

      for (const key in featuresInLayers) {
        const layerFeatures = await getFeaturesById(featuresInLayers[key], key);
        features = [...features, ...layerFeatures];
      }

      mapService.highlightFeatures(features);

      if (features.length === 1) {
        sidebars.openEdit({
          features,
          mode: EditFeatureMode.single
        });
        // позиционирование если не указана позиция карты
        if (!queryParams.center) {
          // для позиционирования с учетом открытого окна атрибутов
          setTimeout(() => {
            mapService.positionToFeature(features[0]);
          }, 200);
        }
      } else {
        sidebars.openFeatures(features);
      }
    }

    // Позиционируемся по BBOX проекта
    if (currentProject.bbox && !route.queryParams.center) {
      mapService.fitToBbox(JSON.parse(currentProject.bbox), [0, 0, 0, 0]);
    }

    this.reactionDisposer = reaction(
      () => [currentProject.visibleLayersBatched, currentProject.attributeTableFilter],
      ([visibleBatches]: [TreeItem<CrgLayer>[][]]) => {
        mapService.hideUserLayers();

        visibleBatches.forEach((batch, i) => {
          const { actualTransparency } = batch[0];

          const layers = batch.map(item => item.payload).reverse();

          void mapService.addLayers(
            layers.filter(l => l.type !== CrgLayerType.EXTERNAL),
            visibleBatches.length - i,
            actualTransparency / 100
          );

          mapService.addExternalLayers(
            layers.filter(l => l.type === CrgLayerType.EXTERNAL),
            visibleBatches.length - i
          );
        });
      },
      { fireImmediately: true }
    );

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

    mapService.mapClick.on(coordinate => this.showFeaturesInfo(coordinate), this);
    mapService.mapMoved.on(({ zoom, center }) => this.setMapPosition(zoom, center), this);
    mapService.zoomChanged.on(value => currentProject.changeZoom(value), this);
  }

  ngOnDestroy(): void {
    mapService.destroyMap();
    printSettings.reset();
    this.reactionDisposer();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    Emitter.scopeOff(this);
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

    const buffer = mapService.getBufferByCoordinates(coordinate);

    mapService.showSelectionMarker(buffer.getCoordinates());

    const collections = await Promise.all(
      Object.entries(visibleLayersComplexNames).map(([srsName, complexNames]) => {
        const xml = makeXmlPolygonIntersect(complexNames, buffer, srsName);

        return getFeaturesByXmlFilter(xml);
      })
    );

    const features = collections.flatMap(({ features }) => features || []);

    if (features.length) {
      await services.provided;
      await services.router.navigate([location.pathname], {
        queryParams: {
          features: features
            .map(feature => {
              return feature.id + MAP_QUERY_PARAMS_DELIMITER + getFeatureLayer(feature).complexName;
            })
            .join(',')
        },
        queryParamsHandling: 'merge'
      });

      if (features.length > 1) {
        sidebars.openFeatures(features);
      } else {
        sidebars.openEdit({
          features,
          mode: EditFeatureMode.single
        });
      }
    } else {
      sidebars.closeFeatures();
      sidebars.closeEdit();
      await services.router.navigate([location.pathname], {
        queryParams: { features: null },
        queryParamsHandling: 'merge'
      });
    }
  }

  private async setMapPosition(zoom: number, center: string): Promise<void> {
    await services.router.navigate([location.pathname], {
      queryParams: {
        zoom: Number(zoom).toFixed(2),
        center
      },
      queryParamsHandling: 'merge'
    });
  }
}
