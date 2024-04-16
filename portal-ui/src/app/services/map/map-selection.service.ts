import { Kinetic, MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { MultiPolygon } from 'ol/geom';
import { DragPan, Extent } from 'ol/interaction';
import ExtentInteraction from 'ol/interaction/Extent';

import { hasPhotoModeInFeatures } from '../data/files/files.util';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { getFeatureCollectionByXmlFilter, makeXmlPolygonIntersect } from '../geoserver/wfs/wfs.service';
import { MapAction, MapMode, MapSelectionTypes } from './map.models';
import { setSelectedFeaturesToUrl } from './map-url.service';
import { WfsFeature } from '../geoserver/wfs/wfs.models';
import { mapService } from './map.service';
import { services } from '../services';

type NamesChunks = { [srsName: string]: string[] };

enum ActiveModifierKey {
  SHIFT,
  CTRL,
  EMPTY
}

class MapSelectionService {
  private static _instance: MapSelectionService;

  private areaExtentAdd = new ExtentInteraction({
    condition: (e: MapBrowserEvent<UIEvent>) => {
      const originalEvent = e.originalEvent as MouseEvent;

      return (
        mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS) &&
        originalEvent.shiftKey &&
        !originalEvent.ctrlKey &&
        originalEvent.button !== 1
      );
    },
    pointerStyle: []
  });

  private areaExtentRemove = new ExtentInteraction({
    condition: (e: MapBrowserEvent<UIEvent>) => {
      const originalEvent = e.originalEvent as MouseEvent;

      return (
        mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS) &&
        originalEvent.ctrlKey &&
        !originalEvent.shiftKey &&
        originalEvent.button !== 1
      );
    },
    pointerStyle: []
  });
  private areaExtentReplace = new ExtentInteraction({
    condition: (e: MapBrowserEvent<UIEvent>) => {
      const originalEvent = e.originalEvent as MouseEvent;

      if (
        mapStore.allowedActions.includes(MapAction.SELECT) &&
        !originalEvent.shiftKey &&
        !originalEvent.ctrlKey &&
        !originalEvent.altKey &&
        originalEvent.button !== 1
      ) {
        mapStore.setSelectionActive(true);

        return true;
      }

      return false;
    },
    pointerStyle: []
  });

  private dragPanWheel = new DragPan({
    condition: (e: MapBrowserEvent<UIEvent>) => {
      const originalEvent = e.originalEvent as MouseEvent;

      return originalEvent.button === 1;
    },
    onFocusOnly: false,
    kinetic: new Kinetic(-0.005, 0.05, 100)
  });

  private activeModifierKey?: ActiveModifierKey;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    mapService.mapCreate.on((): void => {
      mapService.map.addInteraction(this.dragPanWheel);
      mapService.map.addInteraction(this.areaExtentReplace);
      mapService.map.addInteraction(this.areaExtentRemove);
      mapService.map.addInteraction(this.areaExtentAdd);

      // @ts-expect-error - ошибка в типах ol
      mapService.map.on('pointerdown', (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (originalEvent.shiftKey) {
          this.activeModifierKey = ActiveModifierKey.SHIFT;
        } else if (originalEvent.ctrlKey) {
          this.activeModifierKey = ActiveModifierKey.CTRL;
        } else if (!originalEvent.shiftKey && !originalEvent.ctrlKey && !originalEvent.altKey) {
          this.activeModifierKey = ActiveModifierKey.EMPTY;
        }

        this.areaExtentReplace.setActive(true);

        if (originalEvent.button === 1) {
          this.areaExtentReplace.setActive(false);
        }
      });

      mapService.map.on('pointermove', (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (!originalEvent.shiftKey && !originalEvent.ctrlKey) {
          mapStore.setSelectionActive(false);
        } else {
          mapStore.setSelectionActive(true);
        }
      });

      // @ts-expect-error - ошибка в типах ol
      mapService.map.on('wheel', () => {
        this.areaExtentReplace.setActive(false);
      });

      // @ts-expect-error - ошибка в типах ol
      mapService.map.on('pointerup', async (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        if (
          originalEvent.shiftKey &&
          !originalEvent.ctrlKey &&
          this.activeModifierKey === ActiveModifierKey.SHIFT &&
          mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS) &&
          originalEvent.button !== 1
        ) {
          await this.selectFeaturesOnMap(this.areaExtentAdd, MapSelectionTypes.ADD, e.coordinate);
        } else if (
          originalEvent.ctrlKey &&
          !originalEvent.shiftKey &&
          this.activeModifierKey === ActiveModifierKey.CTRL &&
          mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS) &&
          originalEvent.button !== 1
        ) {
          await this.selectFeaturesOnMap(this.areaExtentRemove, MapSelectionTypes.REMOVE, e.coordinate);
        } else if (
          !originalEvent.shiftKey &&
          !originalEvent.ctrlKey &&
          this.activeModifierKey === ActiveModifierKey.EMPTY &&
          mapStore.allowedActions.includes(MapAction.SELECT) &&
          originalEvent.button !== 1
        ) {
          await this.selectFeaturesOnMap(this.areaExtentReplace, MapSelectionTypes.REPLACE, e.coordinate);
        } else {
          this.areaExtentAdd.setExtent([0, 0, 0, 0]);
          this.areaExtentRemove.setExtent([0, 0, 0, 0]);
          this.areaExtentReplace.setExtent([0, 0, 0, 0]);
          mapStore.setSelectionActive(false);
        }
      });
    }, this);

    mapService.mapClick.on(async e => {
      if (mapStore.allowedActions.includes(MapAction.PROKOL)) {
        await this.selectFeaturesByCoordinates(MapSelectionTypes.REPLACE, mapService.getBufferByCoordinates(e.detail));

        sidebars.clearFeaturesWithError();
        sidebars.openSelectedFeaturesSidebar();
      }
    }, this);
  }

  private async selectFeaturesOnMap(
    areaExtent?: Extent,
    selectionType?: MapSelectionTypes,
    coordinate?: Coordinate
  ): Promise<void> {
    if (!areaExtent || !selectionType || !coordinate) {
      return;
    }

    const buffer = this.generateBuffer(areaExtent, coordinate);
    if (buffer) {
      await this.selectFeaturesByCoordinates(selectionType, buffer);
    }
  }

  private generateBuffer(areaExtent: Extent, coordinate: Coordinate): MultiPolygon | undefined {
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
   * Выделить объекты, которые пересекают заданные координаты.
   */
  private async selectFeaturesByCoordinates(selectionType: MapSelectionTypes, buffer: MultiPolygon) {
    await services.provided;
    const visibleLayers = currentProject.visibleVectorLayers.map(({ payload }) => payload);

    if (!visibleLayers.length) {
      services.logger.debug('No visible layers');
      this.selectFeatures([]);

      return;
    }

    const visibleLayersComplexNamesByCrs: NamesChunks = {};

    for (const layer of visibleLayers) {
      const { nativeCRS, complexName } = layer;

      if (!nativeCRS || !complexName) {
        throw new Error('Невозможно провести выделение, некорректный слой');
      }

      if (!visibleLayersComplexNamesByCrs[nativeCRS]) {
        visibleLayersComplexNamesByCrs[nativeCRS] = [];
      }
      visibleLayersComplexNamesByCrs[nativeCRS]?.push(complexName);
    }

    mapService.showSelectionMarker(buffer.getCoordinates());
    const collections = await Promise.all(
      Object.entries(visibleLayersComplexNamesByCrs).flatMap(([srsName, complexNames]) => {
        return complexNames.map(async complexName => {
          const xml = await makeXmlPolygonIntersect(complexName, buffer, srsName, selectionType);

          return getFeatureCollectionByXmlFilter(xml);
        });
      })
    );

    const features = collections.flatMap(({ features }) => features || []);

    const limitOverflow = features.splice(
      Math.max(
        mapStore.selectingFeaturesLimit -
          (selectionType === MapSelectionTypes.ADD ? mapStore.selectedFeatures.length : 0),
        0
      ),
      features.length
    ).length;

    if (features.length || limitOverflow) {
      this.selectFeatures(features, selectionType);
    } else if (selectionType === MapSelectionTypes.REPLACE) {
      this.selectFeatures([]);
    }

    if (hasPhotoModeInFeatures(features)) {
      sidebars.openPhotoLayers(features);
    }
  }

  enableSelectionMode(enabled: boolean): void {
    mapStore.setMode(enabled ? MapMode.DEFAULT : MapMode.SELECTION);
  }

  selectFeatures(features: WfsFeature[], selectionType: MapSelectionTypes = MapSelectionTypes.REPLACE) {
    if (sidebars.needEditConfirmation(this.selectFeatures.bind(this, features, selectionType))) {
      return;
    }

    sidebars.closeEdit();

    if (selectionType === MapSelectionTypes.REPLACE) {
      mapStore.setSelectedFeatures(features);
    } else {
      for (const feature of features) {
        const index = mapStore.selectedFeatures.findIndex(({ id }) => {
          return id === feature.id;
        });

        if (selectionType === MapSelectionTypes.REMOVE && index !== -1) {
          const rests = [...mapStore.selectedFeatures];
          rests.splice(index, 1);
          mapStore.setSelectedFeatures(rests);
        }

        if (selectionType === MapSelectionTypes.ADD && index === -1) {
          mapStore.setSelectedFeatures([...mapStore.selectedFeatures, feature]);
        }
      }
    }

    // удаляем filterBySelection для тех слоев, у которых больше нет выделенных объектов
    if (
      !features.length &&
      (selectionType === MapSelectionTypes.REPLACE || selectionType === MapSelectionTypes.REMOVE)
    ) {
      const layerTableNames = Object.keys(attributesTableStore.filter);

      for (const tableName of layerTableNames) {
        if (!mapStore.selectedFeaturesByTableName[tableName]?.length) {
          attributesTableStore.dropFilterBySelections(tableName);
        }
      }
    }

    mapService.highlightFeatures(mapStore.highlightedFeatures);

    void setSelectedFeaturesToUrl();

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }
}

export const mapSelectionService = MapSelectionService.instance;
