import { reaction, IReactionDisposer } from 'mobx';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Extent } from 'ol/extent';
import { cloneDeep } from 'lodash';
import '!style-loader!css-loader!ol/ol.css';

import { route } from '../../stores/Route.store';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { CrgExternalLayer, CrgLayerType } from '../../services/gis/layers/layers.models';
import { applyMapStateFromNavigator } from '../../services/map/map-link-following.service';
import { mapSelectionService } from '../../services/map/map-selection.service';
import { fetchBasemaps } from '../../services/gis/project-basemaps/project-basemaps.service';
import { setMapPositionToUrl } from '../../services/map/map-url.service';
import { mapService } from '../../services/map/map.service';
import { MapMode } from '../../services/map/map.models';
import { fromMobx } from '../../services/util/fromMobx';
import { Emitter } from '../../services/common/Emitter';
import { cn } from '../../services/util/cn';
import { Toast } from '../Toast/Toast';
import { projectsService } from '../../services/gis/projects/projects.service';

@Component({
  selector: 'crg-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  isBugReportSidebarActive = false;
  isFeaturesSidebarActive = false;
  isEditSidebarActive = false;
  isDefaultActive = false;
  isSelectionActive = false;

  cn = cn('map');

  private reactionDisposer?: IReactionDisposer;
  private unsubscribe$: Subject<void> = new Subject<void>();

  async ngOnInit() {
    await fetchBasemaps();

    const queryParams = route.queryParams as { [key: string]: string };
    const basemap = queryParams?.basemap;

    if (basemap) {
      if (basemapsStore.basemaps.some(({ id }) => id === Number(basemap))) {
        basemapsStore.selectBasemap(Number(basemap));
      } else {
        Toast.warn(`Не удалось подключить подложку id: ${basemap}`);
      }
    }

    mapService.createMap();
    await applyMapStateFromNavigator();

    // Позиционируемся по BBOX проекта
    if (currentProject.bbox && !route.queryParams.center) {
      mapService.fitToBbox(JSON.parse(currentProject.bbox) as Extent, [0, 0, 0, 0]);
    }

    this.reactionDisposer = reaction(
      () => [
        currentProject.visibleOnMapLayers.map(({ payload }) => payload.view),
        cloneDeep(attributesTableStore.filter),
        cloneDeep(attributesTableStore.filterDisabled)
      ],
      async () => {
        if (!mapService.mapInited) {
          return;
        }

        mapService.hideUserLayers();

        for (let i = 0; i < currentProject.visibleOnMapLayers.length; i++) {
          const { actualTransparency, payload: layer } = currentProject.visibleOnMapLayers[i];
          const zIndex = currentProject.visibleOnMapLayers.length - i;

          if (layer.type === CrgLayerType.EXTERNAL) {
            mapService.addExternalLayer(layer as CrgExternalLayer, zIndex);
          } else if (layer.type === CrgLayerType.EXTERNAL_GEOSERVER) {
            mapService.addExternalGeoserverLayer(layer as CrgExternalLayer, zIndex);
          } else {
            await mapService.addLayer(layer, zIndex, actualTransparency / 100);
          }
        }

        mapService.highlightFeatures(mapStore.highlightedFeatures);
      },
      { fireImmediately: true }
    );
    mapService.mapMoved.on(e => setMapPositionToUrl(e.detail.zoom, e.detail.center), this);
    mapService.zoomChanged.on(e => currentProject.changeZoom(e.detail), this);
  }

  ngAfterViewInit() {
    fromMobx(() => sidebars.leftOpen)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });

    fromMobx(() => sidebars.featuresSidebarOpen, true)
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
          this.isDefaultActive = mode === MapMode.SELECTION;
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
    mapStore.setMode(MapMode.DEFAULT);
    mapService.destroyMap();
    mapSelectionService.selectFeatures([]);
    projectsService.clearCurrent();
    printSettings.reset();
    this.reactionDisposer?.();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    Emitter.scopeOff(this);
  }
}
