import { Kinetic, MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { MultiPolygon } from 'ol/geom';
import { DragPan, Extent } from 'ol/interaction';
import ExtentInteraction from 'ol/interaction/Extent';

import { attributesTableStore } from '../../../../stores/AttributesTable.store';
import { currentProject } from '../../../../stores/CurrentProject.store';
import { mapStore } from '../../../../stores/Map.store';
import { sidebars } from '../../../../stores/Sidebars.store';
import { hasPhotoModeInFeatures } from '../../../data/files/files.util';
import { WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { getFeatureCollectionByXmlFilter, makeXmlPolygonIntersect } from '../../../geoserver/wfs/wfs.service';
import { services } from '../../../services';
import { mapDrawService } from '../../draw/map-draw.service';
import { MapAction, MapMode, MapSelectionTypes, ToolMode } from '../../map.models';
import { mapService } from '../../map.service';
import { setSelectedFeaturesToUrl } from '../../map-url.service';
import { mapVerticesModificationService } from '../../vertices-modification/map-vertices-modification.service';
import { EditFeatureMode } from '../edit-feature/EditFeature.models';
import { mapModeManager } from '../MapModeManager';
import { selectedFeaturesStore } from './SelectedFeatures.store';

type NamesChunks = { [srsName: string]: string[] };

enum ActiveModifierKey {
  SHIFT,
  CTRL,
  EMPTY
}

// Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
export const HIT_TOLERANCE = 10;

class MapSelectionService {
  private static _instance: MapSelectionService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

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
        !originalEvent.shiftKey &&
        originalEvent.ctrlKey &&
        originalEvent.button !== 1
      );
    },
    pointerStyle: []
  });

  private areaExtentReplace = new ExtentInteraction({
    condition: (e: MapBrowserEvent<UIEvent>) => {
      const originalEvent = e.originalEvent as MouseEvent;

      if (
        mapStore.toolMode === ToolMode.SELECTION &&
        !originalEvent.shiftKey &&
        !originalEvent.ctrlKey &&
        !originalEvent.altKey &&
        originalEvent.button !== 1
      ) {
        selectedFeaturesStore.setActive(true);

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
  private pointerMoved = false;

  private constructor() {
    mapService.mapCreated.on((): void => {
      mapService.map.addInteraction(this.dragPanWheel);
      mapService.map.addInteraction(this.areaExtentReplace);
      mapService.map.addInteraction(this.areaExtentRemove);
      mapService.map.addInteraction(this.areaExtentAdd);

      // @ts-expect-error - ошибка в типах ol
      mapService.map.on('pointerdown', (e: MapBrowserEvent<UIEvent>) => {
        this.pointerMoved = false;

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
        this.pointerMoved = true;

        const originalEvent = e.originalEvent as MouseEvent;
        if (originalEvent.shiftKey) {
          selectedFeaturesStore.setActive(true);
        } else if (originalEvent.ctrlKey) {
          selectedFeaturesStore.setActive(true);
        } else {
          selectedFeaturesStore.setActive(false);
        }
      });

      // @ts-expect-error - ошибка в типах ol
      mapService.map.on('wheel', () => {
        this.areaExtentReplace.setActive(false);
      });

      // @ts-expect-error - ошибка в типах ol
      mapService.map.on('pointerup', async (e: MapBrowserEvent<UIEvent>) => {
        const originalEvent = e.originalEvent as MouseEvent;

        // Реагируем только на нажатие левой кнопки мыши
        const isNotLeftButton = originalEvent.button !== 0;
        if (isNotLeftButton) {
          return;
        }

        const shiftOnlyPressed =
          originalEvent.shiftKey && !originalEvent.ctrlKey && this.activeModifierKey === ActiveModifierKey.SHIFT;
        const ctrlOnlyPressed =
          !originalEvent.shiftKey && originalEvent.ctrlKey && this.activeModifierKey === ActiveModifierKey.CTRL;
        const noModifiersActive =
          !originalEvent.shiftKey && !originalEvent.ctrlKey && this.activeModifierKey === ActiveModifierKey.EMPTY;

        if (shiftOnlyPressed && mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS)) {
          const buffer = this.getBufferFromExtent(this.areaExtentAdd);
          if (!buffer) {
            return;
          }

          await this.selectFeaturesByBuffer(MapSelectionTypes.ADD, buffer);
        } else if (ctrlOnlyPressed && mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS)) {
          const buffer = this.getBufferFromExtent(this.areaExtentRemove);
          if (!buffer) {
            return;
          }

          await this.selectFeaturesByBuffer(MapSelectionTypes.REMOVE, buffer);
        } else if (noModifiersActive && mapStore.toolMode === ToolMode.SELECTION) {
          const buffer = this.getBufferFromExtent(this.areaExtentReplace);
          if (!buffer) {
            return;
          }

          await this.selectFeaturesByBuffer(MapSelectionTypes.REPLACE, buffer);
        } else if (noModifiersActive && mapStore.toolMode === ToolMode.NONE) {
          if (this.pointerMoved) {
            return;
          }

          if (mapStore.allowedActions.includes(MapAction.PROKOL)) {
            const buffer = this.mapExtendToBuffer(this.getExtendFromSingleClick(e.coordinate));

            mapDrawService.showSelectionMarker(buffer.getCoordinates());
            const features: WfsFeature[] = await this.fetchFeatures(MapSelectionTypes.REPLACE, buffer);

            await mapModeManager.changeMode(MapMode.NONE, undefined, 'прокол - нет фичей');

            if (features.length > 1) {
              await mapModeManager.changeMode(
                MapMode.SELECTED_FEATURES,
                {
                  payload: {
                    features: features,
                    type: MapSelectionTypes.REPLACE
                  }
                },
                'прокол - нескольких фичей'
              );
            } else if (features.length === 1) {
              await mapModeManager.changeMode(
                MapMode.SELECTED_FEATURES,
                {
                  payload: {
                    features: features,
                    type: MapSelectionTypes.REPLACE
                  }
                },
                'прокол - одной фичи 1'
              );

              await mapModeManager.changeMode(
                MapMode.EDIT_FEATURE,
                {
                  payload: {
                    features,
                    mode: EditFeatureMode.single
                  }
                },
                'прокол - одной фичи 2'
              );
            }
          } else {
            services.logger.info('Действие запрещено');
          }

          this.pointerMoved = false;
        } else {
          this.areaExtentAdd.setExtent([0, 0, 0, 0]);
          this.areaExtentRemove.setExtent([0, 0, 0, 0]);
          this.areaExtentReplace.setExtent([0, 0, 0, 0]);
          selectedFeaturesStore.setActive(false);
        }
      });
    }, this);
  }

  selectFeatures(features: WfsFeature[], selectionType: MapSelectionTypes = MapSelectionTypes.REPLACE) {
    // TODO: Отрефакторить. Все события по 'Esc, Esc' сваливаются сюда...
    if (mapStore.mode === MapMode.VERTICES_MODIFICATION) {
      mapVerticesModificationService.verticesModificationOff();

      return;
    }

    if (selectionType === MapSelectionTypes.REPLACE) {
      selectedFeaturesStore.setFeatures(features);
    } else {
      for (const feature of features) {
        const index = selectedFeaturesStore.features.findIndex(({ id }) => {
          return id === feature.id;
        });

        if (selectionType === MapSelectionTypes.REMOVE && index !== -1) {
          const rests = [...selectedFeaturesStore.features];
          rests.splice(index, 1);

          selectedFeaturesStore.setFeatures(rests);
        }

        if (selectionType === MapSelectionTypes.ADD && index === -1) {
          selectedFeaturesStore.setFeatures([...selectedFeaturesStore.features, feature]);
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
        if (!selectedFeaturesStore.featuresByTableName[tableName]?.length) {
          attributesTableStore.dropFilterBySelections(tableName);
        }
      }
    }

    void mapDrawService.reDrawFeatures(selectedFeaturesStore.filtersByLayersFeatures);
    void setSelectedFeaturesToUrl();

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }

  /**
   * Выделить объекты, которые пересекают заданные координаты.
   */
  private async selectFeaturesByBuffer(selectionType: MapSelectionTypes, buffer: MultiPolygon) {
    mapDrawService.showSelectionMarker(buffer.getCoordinates());

    const features: WfsFeature[] = await this.fetchFeatures(selectionType, buffer);
    const limitOverflow = features.splice(
      Math.max(
        selectedFeaturesStore.limit -
          (selectionType === MapSelectionTypes.ADD ? selectedFeaturesStore.features.length : 0),
        0
      ),
      features.length
    ).length;

    if (features.length || limitOverflow) {
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: features,
            type: selectionType
          }
        },
        'selectFeaturesByBuffer - 1'
      );
    } else if (selectionType === MapSelectionTypes.REPLACE) {
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: [],
            type: selectionType
          }
        },
        'selectFeaturesByBuffer - 2'
      );
    }

    if (hasPhotoModeInFeatures(features)) {
      sidebars.openPhotoModePreviewer(features);
    }
  }

  private getBufferFromExtent(extentArea: Extent): MultiPolygon | null {
    if (!extentArea) {
      return null;
    }

    const extent = extentArea.getExtent();
    const buffer: MultiPolygon =
      extent[0] === extent[2] && extent[1] === extent[3]
        ? this.mapExtendToBuffer(this.getExtendFromSingleClick([extent[0], extent[1]]))
        : this.mapExtendToBuffer(extent);

    // Очистка области выделения
    extentArea.setExtent([0, 0, 0, 0]);

    return buffer;
  }

  private mapExtendToBuffer(extent: Array<number> = [0, 0, 0, 0]): MultiPolygon {
    const x1 = extent[0];
    const x2 = extent[2];
    const y1 = extent[1];
    const y2 = extent[3];

    return new MultiPolygon([
      [
        [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
          [x1, y1]
        ]
      ]
    ]);
  }

  private getExtendFromSingleClick(coordinate: Coordinate): Array<number> {
    if (!coordinate) {
      return this.getExtendFromSingleClick([0, 0]);
    }

    const dt = mapService.getResolution() * HIT_TOLERANCE;
    const res = Number(dt.toFixed(mapService.PRECISION));

    const roundedPos = coordinate.map(num => Number(num.toFixed(4)));

    const x1 = roundedPos[0] + res / 2;
    const x2 = x1 - res;
    const y1 = roundedPos[1] + res / 2;
    const y2 = y1 - res;

    return [x2, y2, x1, y1];
  }

  private async fetchFeatures(selectionType: MapSelectionTypes, buffer: MultiPolygon): Promise<WfsFeature[]> {
    await services.provided;

    const visibleLayers = currentProject.visibleVectorLayers.map(({ payload }) => payload);
    if (!visibleLayers.length) {
      services.logger.debug('No visible layers');

      return [];
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

    const collections = await Promise.all(
      Object.entries(visibleLayersComplexNamesByCrs).flatMap(([srsName, complexNames]) => {
        return complexNames.map(async complexName => {
          const xml = await makeXmlPolygonIntersect(complexName, buffer, srsName, selectionType);

          return getFeatureCollectionByXmlFilter(xml);
        });
      })
    );

    return collections.flatMap(({ features }) => features || []);
  }
}

export const mapSelectionService = MapSelectionService.instance;
