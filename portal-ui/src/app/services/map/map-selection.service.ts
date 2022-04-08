import { Kinetic, MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { MultiPolygon } from 'ol/geom';
import { DragPan, Extent } from 'ol/interaction';
import ExtentInteraction from 'ol/interaction/Extent';

import { mapService } from './map.service';
import { services } from '../services';
import { makeXmlPolygonIntersect } from '../util/wfs.util';
import { currentProject } from '../../stores/CurrentProject.store';
import { getFeaturesByXmlFilter } from '../geoserver/wfs.service';
import { MapActions, MapModes, mapStore } from '../../stores/Map.store';
import { MapSelectionTypes, sidebars } from '../../stores/Sidebars.store';
import { getFeatureLayer } from '../geoserver/layers.service';
import { MAP_QUERY_PARAMS_DELIMITER } from './map-link-following.service';
import { WfsFeature } from '../geoserver/wfs.models';

type NamesChunks = { [srsName: string]: string[] };

enum ActiveHotKey {
  SHIFT,
  CTRL,
  EMPTY
}

class MapSelectionService {
  private static _instance: MapSelectionService;

  private areaExtentAdd: ExtentInteraction;
  private areaExtentRemove: ExtentInteraction;
  private areaExtentReplace: ExtentInteraction;
  private dragPanWheel: DragPan;
  private activeHotKey: ActiveHotKey;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.areaExtentAdd = new ExtentInteraction({
      condition: (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        return (
          mapStore.allowedActions.includes(MapActions.SELECT_WITH_MODIFICATORS) &&
          originalEvent.shiftKey &&
          !originalEvent.ctrlKey &&
          originalEvent.button !== 1
        );
      },
      pointerStyle: []
    });

    this.areaExtentRemove = new ExtentInteraction({
      condition: (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        return (
          mapStore.allowedActions.includes(MapActions.SELECT_WITH_MODIFICATORS) &&
          originalEvent.ctrlKey &&
          !originalEvent.shiftKey &&
          originalEvent.button !== 1
        );
      },
      pointerStyle: []
    });

    this.areaExtentReplace = new ExtentInteraction({
      condition: (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (
          mapStore.allowedActions.includes(MapActions.SELECT) &&
          !originalEvent.shiftKey &&
          !originalEvent.ctrlKey &&
          !originalEvent.altKey &&
          originalEvent.button !== 1
        ) {
          mapStore.isSelectionActive(true);

          return true;
        }
      },
      pointerStyle: []
    });

    this.dragPanWheel = new DragPan({
      condition: (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        return originalEvent.button === 1;
      },
      onFocusOnly: false,
      kinetic: new Kinetic(-0.005, 0.05, 100)
    });

    mapService.mapCreate.on((): void => {
      mapService.map.addInteraction(this.dragPanWheel);
      mapService.map.addInteraction(this.areaExtentReplace);
      mapService.map.addInteraction(this.areaExtentRemove);
      mapService.map.addInteraction(this.areaExtentAdd);

      // ошибка в типах ol
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mapService.map.on('pointerdown', (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (originalEvent.shiftKey) {
          this.activeHotKey = ActiveHotKey.SHIFT;
        } else if (originalEvent.ctrlKey) {
          this.activeHotKey = ActiveHotKey.CTRL;
        } else if (!originalEvent.shiftKey && !originalEvent.ctrlKey && !originalEvent.altKey) {
          this.activeHotKey = ActiveHotKey.EMPTY;
        }

        this.areaExtentReplace.setActive(true);

        if (originalEvent.button === 1) {
          this.areaExtentReplace.setActive(false);
        }
      });

      mapService.map.on('pointermove', (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (!originalEvent.shiftKey && !originalEvent.ctrlKey) {
          mapStore.isSelectionActive(false);
        } else {
          mapStore.isSelectionActive(true);
        }
      });

      // ошибка в типах ol
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mapService.map.on('wheel', () => {
        this.areaExtentReplace.setActive(false);
      });

      // ошибка в типах ol
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mapService.map.on('pointerup', async (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (
          originalEvent.shiftKey &&
          !originalEvent.ctrlKey &&
          this.activeHotKey === ActiveHotKey.SHIFT &&
          mapStore.allowedActions.includes(MapActions.SELECT_WITH_MODIFICATORS) &&
          originalEvent.button !== 1
        ) {
          await this.setFeaturesInfo(this.areaExtentAdd, MapSelectionTypes.ADD, e.coordinate);
        } else if (
          originalEvent.ctrlKey &&
          !originalEvent.shiftKey &&
          this.activeHotKey === ActiveHotKey.CTRL &&
          mapStore.allowedActions.includes(MapActions.SELECT_WITH_MODIFICATORS) &&
          originalEvent.button !== 1
        ) {
          await this.setFeaturesInfo(this.areaExtentRemove, MapSelectionTypes.REMOVE, e.coordinate);
        } else if (
          !originalEvent.shiftKey &&
          !originalEvent.ctrlKey &&
          this.activeHotKey === ActiveHotKey.EMPTY &&
          mapStore.allowedActions.includes(MapActions.SELECT) &&
          originalEvent.button !== 1
        ) {
          await this.setFeaturesInfo(this.areaExtentReplace, MapSelectionTypes.REPLACE, e.coordinate);
        } else {
          this.areaExtentAdd.setExtent([0, 0, 0, 0]);
          this.areaExtentRemove.setExtent([0, 0, 0, 0]);
          this.areaExtentReplace.setExtent([0, 0, 0, 0]);
          mapStore.isSelectionActive(false);
        }
      });
    }, this);

    mapService.mapClick.on(async coordinate => {
      if (mapStore.allowedActions.includes(MapActions.PROKOL)) {
        await this.showFeaturesInfo(MapSelectionTypes.REPLACE, mapService.getBufferByCoordinates(coordinate));

        sidebars.clearFeaturesWithError();
      }
    }, this);
  }

  async setFeaturesInfo(
    areaExtent?: Extent,
    selectionType?: MapSelectionTypes,
    coordinate?: Coordinate
  ): Promise<void> {
    const buffer = this.generateBuffer(areaExtent, coordinate);
    await this.showFeaturesInfo(selectionType, buffer);
  }

  generateBuffer(areaExtent: Extent, coordinate: Coordinate): MultiPolygon {
    const extent = areaExtent.getExtent();
    areaExtent.setExtent([0, 0, 0, 0]);

    if (extent) {
      const x1 = extent[0];
      const x2 = extent[2];
      const y1 = extent[1];
      const y2 = extent[3];

      if (x1 === x2 && y1 === y2) {
        if (coordinate) {
          return mapService.getBufferByCoordinates(coordinate);
        }

        return mapService.getBufferByCoordinates([0, 0]);
      }
      const buffer = [
        [
          [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
            [x1, y1]
          ]
        ]
      ];

      return new MultiPolygon(buffer);
    }
  }

  /**
   * Отобразить информацию об объектах, которые пересекают заданные координаты.
   */
  private async showFeaturesInfo(selectionType: MapSelectionTypes, buffer: MultiPolygon) {
    await services.provided;
    const visibleLayers = currentProject.visibleLayersWithoutRasters.map(({ payload }) => payload);
    if (!visibleLayers.length) {
      services.logger.debug('No visible layers');

      return;
    }

    sidebars.setFeaturesLimit(false);

    const visibleLayersComplexNamesByCrs: NamesChunks = {};

    for (const layer of visibleLayers) {
      const { nativeCRS, complexName } = layer;

      if (!visibleLayersComplexNamesByCrs[nativeCRS]) {
        visibleLayersComplexNamesByCrs[nativeCRS] = [];
      }

      visibleLayersComplexNamesByCrs[nativeCRS].push(complexName);
    }

    mapService.showSelectionMarker(buffer.getCoordinates());
    const collections = await Promise.all(
      Object.entries(visibleLayersComplexNamesByCrs).map(([srsName, complexNames]) => {
        const xml = makeXmlPolygonIntersect(complexNames, buffer, srsName, selectionType);

        return getFeaturesByXmlFilter(xml);
      })
    );

    const features = collections.flatMap(({ features }) => features || []).slice(0, 100);

    if (
      features.length + (sidebars.viewFeatures?.length ? sidebars.viewFeatures?.length : 0) > 100 &&
      selectionType === MapSelectionTypes.ADD
    ) {
      sidebars.setFeaturesLimit(true);

      return;
    }

    if (features.length === 100) {
      sidebars.setFeaturesLimit(true);
    }

    if (features.length) {
      let queryFeatures: WfsFeature[];
      if (selectionType === MapSelectionTypes.ADD) {
        queryFeatures = sidebars.viewFeatures ? [...features, ...sidebars.viewFeatures] : features;
      } else if (selectionType === MapSelectionTypes.REPLACE) {
        queryFeatures = features;
      } else {
        queryFeatures = [...sidebars.viewFeatures]
          .map(feature => {
            if (!features.some(feat => feat.id === feature.id)) {
              return feature;
            }
          })
          .filter(feature => feature);
      }

      await services.provided;
      await services.router.navigate([location.pathname], {
        queryParams: {
          features: queryFeatures
            .map(feature => {
              return `${feature.id}${MAP_QUERY_PARAMS_DELIMITER}${getFeatureLayer(feature).complexName}`;
            })
            .join(','),
          queryFilter: null,
          queryLayers: null
        },
        queryParamsHandling: 'merge'
      });

      sidebars.openFeatures(features, selectionType);
    } else {
      sidebars.closeFeatures();
      sidebars.closeEdit();
      await services.router.navigate([location.pathname], {
        queryParams: {
          features: null,
          queryFilter: null,
          queryLayers: null
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  enableSelectionMode(enabled: boolean): void {
    mapStore.setMode(enabled ? MapModes.DEFAULT : MapModes.SELECTION);
  }
}

export const mapSelectionService = MapSelectionService.instance;
