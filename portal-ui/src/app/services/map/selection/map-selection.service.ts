import { Kinetic, type MapBrowserEvent } from 'ol';
import { type Coordinate } from 'ol/coordinate';
import { MultiPolygon } from 'ol/geom';
import { DragPan, type Extent } from 'ol/interaction';
import ExtentInteraction from 'ol/interaction/Extent';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { mapStore } from '../../../stores/Map.store';
import { selectedFeaturesStore } from '../../../stores/SelectedFeatures.store';
import { sidebars } from '../../../stores/Sidebars.store';
import { hasPhotoModeInFeatures } from '../../data/files/files.util';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getFeatureCollectionByXmlFilter, makeXmlPolygonIntersect } from '../../geoserver/wfs/wfs.service';
import { fetchVisibleNspdFeatures, hasVisibleNspdLayers } from '../../nspd/feature-info/nspd-feature-info.service';
import { services } from '../../services';
import { mapDrawService } from '../draw/map-draw.service';
import { MapAction, MapMode, MapSelectionTypes, ToolMode } from '../map.models';
import { mapService } from '../map.service';
import { setSelectedFeaturesToUrl } from '../map-url.service';
import { EditFeatureMode } from '../mode/map-mode.models';
import { mapModeService } from '../mode/map-mode.service';
import { mapVerticesModificationService } from '../vertices-modification/map-vertices-modification.service';

enum ModifierKey {
  SHIFT,
  CTRL,
  NONE
}

// Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
export const HIT_TOLERANCE = 10;

class MapSelectionService {
  private static _instance: MapSelectionService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private prokolRequestId = 0;
  private selectionEpoch = 0;

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

  private activeModifierKey?: ModifierKey;
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
          this.activeModifierKey = ModifierKey.SHIFT;
        } else if (originalEvent.ctrlKey) {
          this.activeModifierKey = ModifierKey.CTRL;
        } else if (!originalEvent.shiftKey && !originalEvent.ctrlKey && !originalEvent.altKey) {
          this.activeModifierKey = ModifierKey.NONE;
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
          originalEvent.shiftKey && !originalEvent.ctrlKey && this.activeModifierKey === ModifierKey.SHIFT;
        const ctrlOnlyPressed =
          !originalEvent.shiftKey && originalEvent.ctrlKey && this.activeModifierKey === ModifierKey.CTRL;
        const noModifiersActive =
          !originalEvent.shiftKey && !originalEvent.ctrlKey && this.activeModifierKey === ModifierKey.NONE;

        if (shiftOnlyPressed && mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS)) {
          const selection = this.getBufferFromExtent(this.areaExtentAdd);
          if (!selection) {
            return;
          }

          await this.selectFeaturesByBuffer(MapSelectionTypes.ADD, selection.buffer, selection.clickCoordinate);
        } else if (ctrlOnlyPressed && mapStore.allowedActions.includes(MapAction.SELECT_WITH_MODIFICATORS)) {
          const selection = this.getBufferFromExtent(this.areaExtentRemove);
          if (!selection) {
            return;
          }

          await this.selectFeaturesByBuffer(MapSelectionTypes.REMOVE, selection.buffer, selection.clickCoordinate);
        } else if (noModifiersActive && mapStore.toolMode === ToolMode.SELECTION) {
          const selection = this.getBufferFromExtent(this.areaExtentReplace);
          if (!selection) {
            return;
          }

          await this.selectFeaturesByBuffer(MapSelectionTypes.REPLACE, selection.buffer, selection.clickCoordinate);
        } else if (noModifiersActive && mapStore.toolMode === ToolMode.NONE) {
          if (this.pointerMoved) {
            return;
          }

          if (mapStore.allowedActions.includes(MapAction.PROKOL)) {
            const buffer = this.mapExtendToBuffer(this.getExtendFromSingleClick(e.coordinate));
            await this.handleProkol(e.coordinate, buffer);
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

  /**
   * Прокол: векторные слои выделяем сразу, НСПД дорисовываем по готовности GetFeatureInfo.
   * При видимых НСПД карточку не открываем, пока не известен итог GetFeatureInfo.
   */
  private async handleProkol(coordinate: Coordinate, buffer: MultiPolygon): Promise<void> {
    const requestId = ++this.prokolRequestId;
    mapDrawService.showSelectionMarker(buffer.getCoordinates());

    const waitForNspd = hasVisibleNspdLayers();
    const nspdPromise = waitForNspd ? fetchVisibleNspdFeatures(coordinate) : Promise.resolve([]);
    const vectorFeatures = await this.fetchFeatures(MapSelectionTypes.REPLACE, buffer);

    if (requestId !== this.prokolRequestId) {
      return;
    }

    if (hasPhotoModeInFeatures(vectorFeatures)) {
      sidebars.openPhotoModePreviewer(vectorFeatures);
    }

    await (waitForNspd ? this.applyProkolSelectionList(vectorFeatures) : this.applyProkolSelection(vectorFeatures));

    if (waitForNspd) {
      const selectionEpoch = this.selectionEpoch;
      const nspdFeatures = await nspdPromise;

      if (requestId !== this.prokolRequestId || selectionEpoch !== this.selectionEpoch) {
        return;
      }

      const room = Math.max(selectedFeaturesStore.limit - selectedFeaturesStore.features.length, 0);
      const toAdd = nspdFeatures.slice(0, room);

      if (toAdd.length) {
        if (selectedFeaturesStore.features.length) {
          this.selectFeatures(toAdd, MapSelectionTypes.ADD);
        } else {
          await this.applyProkolSelectionList(toAdd);
        }
      }

      if (requestId !== this.prokolRequestId) {
        return;
      }

      await this.finalizeProkolSelectionAfterNspd();
    }
  }

  private async applyProkolSelectionList(features: WfsFeature[]): Promise<void> {
    await mapModeService.changeMode(MapMode.NONE, undefined, 'прокол - список до НСПД');

    if (!features.length) {
      return;
    }

    await mapModeService.changeMode(
      MapMode.SELECTED_FEATURES,
      {
        payload: {
          features,
          type: MapSelectionTypes.REPLACE
        }
      },
      'прокол - список до НСПД'
    );
  }

  private async finalizeProkolSelectionAfterNspd(): Promise<void> {
    if (mapStore.mode === MapMode.EDIT_FEATURE) {
      return;
    }

    const features = selectedFeaturesStore.features;

    if (features.length === 0) {
      await mapModeService.changeMode(MapMode.NONE, undefined, 'прокол - после НСПД пусто');

      return;
    }

    if (features.length === 1) {
      if (mapStore.mode !== MapMode.SELECTED_FEATURES) {
        await mapModeService.changeMode(
          MapMode.SELECTED_FEATURES,
          {
            payload: {
              features,
              type: MapSelectionTypes.REPLACE
            }
          },
          'прокол - после НСПД одна фича 1'
        );
      }

      await mapModeService.changeMode(
        MapMode.EDIT_FEATURE,
        {
          payload: {
            features,
            mode: EditFeatureMode.single
          }
        },
        'прокол - после НСПД одна фича 2'
      );
    }
  }

  private async applyProkolSelection(features: WfsFeature[]): Promise<void> {
    await mapModeService.changeMode(MapMode.NONE, undefined, 'прокол - нет фичей');

    if (features.length > 1) {
      await mapModeService.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features,
            type: MapSelectionTypes.REPLACE
          }
        },
        'прокол - нескольких фичей'
      );
    } else if (features.length === 1) {
      await mapModeService.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features,
            type: MapSelectionTypes.REPLACE
          }
        },
        'прокол - одной фичи 1'
      );

      await mapModeService.changeMode(
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
  }

  selectFeatures(features: WfsFeature[], selectionType: MapSelectionTypes = MapSelectionTypes.REPLACE) {
    // TODO: Отрефакторить. Все события по 'Esc, Esc' сваливаются сюда...
    if (mapStore.mode === MapMode.VERTICES_MODIFICATION) {
      mapVerticesModificationService.verticesModificationOff();

      return;
    }

    if (selectionType === MapSelectionTypes.REPLACE) {
      this.selectionEpoch++;
      sidebars.clearFeaturesWithError();
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
        if (!selectedFeaturesStore.featuresByResourceId[tableName]?.length) {
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
   * При одиночном клике (nspdCoordinate) дополнительно запрашивает объекты НСПД.
   */
  private async selectFeaturesByBuffer(
    selectionType: MapSelectionTypes,
    buffer: MultiPolygon,
    nspdCoordinate?: Coordinate
  ) {
    mapDrawService.showSelectionMarker(buffer.getCoordinates());

    const [vectorFeatures, nspdFeatures] = await Promise.all([
      this.fetchFeatures(selectionType, buffer),
      nspdCoordinate && hasVisibleNspdLayers() ? fetchVisibleNspdFeatures(nspdCoordinate) : Promise.resolve([])
    ]);

    const features: WfsFeature[] = [...vectorFeatures, ...nspdFeatures];

    const limitOverflow = features.splice(
      Math.max(
        selectedFeaturesStore.limit -
          (selectionType === MapSelectionTypes.ADD ? selectedFeaturesStore.features.length : 0),
        0
      )
    ).length;

    if (features.length || limitOverflow) {
      await mapModeService.changeMode(
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
      await mapModeService.changeMode(
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

  private getBufferFromExtent(extentArea: Extent): { buffer: MultiPolygon; clickCoordinate?: Coordinate } | null {
    if (!extentArea) {
      return null;
    }

    const extent = extentArea.getExtent();
    const isClick = extent[0] === extent[2] && extent[1] === extent[3];
    const buffer: MultiPolygon = isClick
      ? this.mapExtendToBuffer(this.getExtendFromSingleClick([extent[0], extent[1]]))
      : this.mapExtendToBuffer(extent);

    // Очистка области выделения
    extentArea.setExtent([0, 0, 0, 0]);

    return {
      buffer,
      clickCoordinate: isClick ? [extent[0], extent[1]] : undefined
    };
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

    const visibleLayersComplexNamesByCrs: { [srsName: string]: string[] } = {};
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
