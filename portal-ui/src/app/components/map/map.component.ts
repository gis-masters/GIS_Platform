import { IReactionDisposer, reaction } from 'mobx';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Extent } from 'ol/extent';
import { Subject } from 'rxjs';
import '!style-loader!css-loader!ol/ol.css';

import { Emitter } from '../../services/common/Emitter';
import { cursorHandler } from '../../services/cursor.handler';
import { getOlProjection } from '../../services/data/projections/projections.service';
import { CrgExternalLayer, CrgLayerType } from '../../services/gis/layers/layers.models';
import { fetchCurrentProjectBasemaps } from '../../services/gis/project-basemaps/project-basemaps.service';
import { projectsService } from '../../services/gis/projects/projects.service';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { MapMode, ToolMode } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { applyMapStateFromNavigator } from '../../services/map/map-link-following.service';
import { setMapPositionToUrl } from '../../services/map/map-url.service';
import { cn } from '../../services/util/cn';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { mapStore } from '../../stores/Map.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { route } from '../../stores/Route.store';
import { sidebars } from '../../stores/Sidebars.store';
import { Toast } from '../Toast/Toast';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  cn = cn('map');

  private reactionDisposer?: IReactionDisposer;
  private activeFeatureReactionDisposer?: IReactionDisposer;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private cdRef: ChangeDetectorRef) {
    void getOlProjection();
  }

  async ngOnInit() {
    await fetchCurrentProjectBasemaps();

    const queryParams = route.queryParams as { [key: string]: string };
    const basemap = queryParams?.basemap;

    if (queryParams.zoom) {
      currentProject.changeZoom(Number(queryParams.zoom));
    }

    if (basemap) {
      if (basemapsStore.basemaps.some(({ id }) => id === Number(basemap))) {
        basemapsStore.selectBasemap(Number(basemap));
      } else {
        Toast.warn(`Не удалось подключить подложку id: ${basemap}`);
      }
    }

    mapService.createMap();
    mapDrawService.initializeDraw();
    await applyMapStateFromNavigator();

    // Позиционируемся по BBOX проекта
    if (currentProject.bbox && !route.queryParams.center) {
      mapService.fitToBbox(JSON.parse(currentProject.bbox) as Extent, [0, 0, 0, 0]);
    }

    this.activeFeatureReactionDisposer = reaction(
      () => selectedFeaturesStore.activeFeature,
      async () => {
        await mapDrawService.reDrawFeatures();
      },
      { fireImmediately: true }
    );

    this.reactionDisposer = reaction(
      () => [
        currentProject.visibleOnMapLayers.map(({ payload }) => [
          payload.view,
          payload.styleName,
          payload.style,
          payload.nativeCRS
        ]),
        cloneDeep(attributesTableStore.filter),
        cloneDeep(attributesTableStore.filterDisabled)
      ],
      async () => {
        if (!mapService.mapInited) {
          return;
        }

        mapService.hideUserLayers();

        for (let i = 0; i < currentProject.visibleOnMapLayers.length; i++) {
          const { actualTransparency = 0, payload: layer } = currentProject.visibleOnMapLayers[i];
          const zIndex = currentProject.visibleOnMapLayers.length - i;

          const isHealthy = await projectsService.checkLayerHealthy(layer);
          if (!isHealthy) {
            continue;
          }

          switch (layer.type) {
            case CrgLayerType.EXTERNAL: {
              mapService.addExternalLayer(layer as CrgExternalLayer, zIndex);

              break;
            }
            case CrgLayerType.EXTERNAL_NSPD: {
              mapService.addNspdExternalLayer(layer as CrgExternalLayer, zIndex);

              break;
            }
            case CrgLayerType.EXTERNAL_GEOSERVER: {
              mapService.addExternalGeoserverLayer(layer as CrgExternalLayer, zIndex);

              break;
            }
            default: {
              await mapService.addLayer(layer, zIndex, actualTransparency / 100);
            }
          }
        }

        // Убираю highlightFeatures так как это действие вызывается каждый раз при зуме и очищает draft слой на
        // котором мы рисуем и редактируем фичи. Подскажите что тут и зачем, чтобы починить.
        // if (currentProject.visibleOnMapLayers.length) {
        //   await mapService.highlightFeatures(mapStore.highlightedFeatures);
        // }
      },
      { fireImmediately: true }
    );

    mapService.mapMoved.on(e => setMapPositionToUrl(e.detail.zoom, e.detail.center), this);
    mapService.zoomChanged.on(e => currentProject.changeZoom(e.detail), this);

    cursorHandler.init();
    await mapModeManager.init();
  }

  ngOnDestroy(): void {
    mapService.destroyMap();

    void mapModeManager.changeMode(MapMode.NONE, undefined, 'map ngOnDestroy');

    projectsService.clearCurrent();
    printSettings.reset();
    this.reactionDisposer?.();
    this.activeFeatureReactionDisposer?.();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    Emitter.scopeOff(this);
  }

  protected readonly mapStore = mapStore;
  protected readonly MapMode = MapMode;
  protected readonly sidebars = sidebars;
  protected readonly ToolMode = ToolMode;
  protected readonly selectedFeaturesStore = selectedFeaturesStore;
}
