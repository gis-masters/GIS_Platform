import { reaction, IReactionDisposer } from 'mobx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import '!style-loader!css-loader!sass-loader!ol/ol.css';

import { cn } from '../../services/util/cn';
import { CrgLayer, CrgLayerType, TreeItem } from '../../services/crg/projects.models';
import { mapService } from '../../services/map/map.service';
import { getFeaturesById } from '../../services/geoserver/wfs.service';
import { fetchBasemaps } from '../../services/crg/basemaps.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { fromMobx } from '../../services/util/fromMobx';
import { Emitter } from '../../services/util/Emitter';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { route } from '../../stores/Route.store';
import { services } from '../../services/services';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { printSettings } from '../../stores/PrintSettings.store';
import { MapModes, mapStore } from '../../stores/Map.store';

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
  isDefaultActive = false;
  isSelectionActive = false;

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
    mapService.mapMoved.on(({ zoom, center }) => this.setMapPosition(zoom, center), this);
    mapService.zoomChanged.on(value => currentProject.changeZoom(value), this);
  }

  ngAfterViewInit() {
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
      .pipe(takeUntil(this.unsubscribe$), debounceTime(0))
      .subscribe(featuresOpen => {
        this.isFeaturesSidebarActive = featuresOpen;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.editOpen, true)
      .pipe(takeUntil(this.unsubscribe$), debounceTime(0))
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

    fromMobx(() => mapStore.mode, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(mode => {
        setTimeout(() => {
          this.isDefaultActive = mode === MapModes.SELECTION;
        }, 0);
      });

    fromMobx(() => mapStore.selectionActive, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(selectionActive => {
        setTimeout(() => {
          this.isSelectionActive = selectionActive;
        }, 0);
      });
  }

  ngOnDestroy(): void {
    mapService.destroyMap();
    printSettings.reset();
    this.reactionDisposer();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    Emitter.scopeOff(this);
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
