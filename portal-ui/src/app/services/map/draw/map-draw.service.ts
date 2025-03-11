import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { communicationService } from '../../communication.service';
import { Projection } from '../../data/projections/projections.models';
import { getFeatureProjection, getOlProjection } from '../../data/projections/projections.service';
import { GeometryType, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { transformGeometry } from '../../util/coordinates-transform.util';
import { wfsFeaturesToOlFeatures, wfsFeatureToFeature } from '../../util/open-layers.util';
import { editFeatureStore } from '../a-map-mode/edit-feature/EditFeatureStore';
import { selectedFeaturesStore } from '../a-map-mode/selected-features/SelectedFeatures.store';
import { mapService } from '../map.service';
import { mapSnapService } from '../snap/map-snap.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';
import { mapVerticesModificationService } from '../vertices-modification/map-vertices-modification.service';
import { SingleDrawGeometryType } from './map-draw.models';

class MapDrawService {
  private static _instance: MapDrawService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private modify?: Modify | null;
  private draw?: Draw | null;
  private source: VectorSource = new VectorSource<Feature<Geometry>>({
    features: []
  });

  initializeDraw() {
    const drawLayer = new VectorLayer({
      source: this.source,
      zIndex: mapService.DRAFT_LAYER_Z_INDEX,
      style: getStyle(KnownStyleKey.DrawLayerStyles),
      properties: { name: 'draft' }
    });

    mapService.map.addLayer(drawLayer);
  }

  drawOn(geometryType: SingleDrawGeometryType) {
    mapVerticesModificationService.verticesModificationOff();

    // Modify
    this.modify = new Modify({
      source: this.source,
      condition: event => {
        const closestFeature = this.source.getClosestFeatureToCoordinate(event.coordinate);
        if (closestFeature === undefined || closestFeature?.getId() === undefined) {
          return true;
        }

        return editFeatureStore.editFeaturesData?.features[0]?.id === closestFeature.getId();
      }
    });
    this.modify.on('modifyend', (event: ModifyEvent) => {
      communicationService.modifyEnd.emit(event);
    });
    mapService.map.addInteraction(this.modify);

    // Draw
    this.draw = new Draw({
      source: this.source,
      type: geometryType,
      style: getStyle(KnownStyleKey.DrawStyles)
    });
    this.draw.setActive(true);
    this.draw?.on('drawend', (event: DrawEvent) => {
      communicationService.drawEnd.emit(event);
    });
    mapService.map.addInteraction(this.draw);

    mapSnapService.activate();
  }

  drawOff() {
    if (this.draw) {
      this.draw.setActive(false);
      mapService.map.removeInteraction(this.draw);
      this.draw = null;
    }

    if (this.modify) {
      this.modify.setActive(false);
      mapService.map.removeInteraction(this.modify);
      this.modify = null;
    }

    mapSnapService.deactivate();
  }

  /**
   * Подсвечивает объекты. (очищает черновой слой)
   */
  async highlightFeatures(features: WfsFeature[], projection?: Projection) {
    const featuresInOlProjection: WfsFeature[] = await Promise.all(
      [...features]
        .filter(({ geometry }) => geometry)
        .map(async (feature: WfsFeature): Promise<WfsFeature> => {
          const currentProjection = projection || (await getFeatureProjection(feature));
          const olProjection = await getOlProjection();

          if (!currentProjection || !olProjection) {
            throw new Error('Не найдена проекция выбранного объекта');
          }
          const geometry = feature.geometry && transformGeometry(feature.geometry, currentProjection, olProjection);

          if (!geometry) {
            throw new Error('Геометрия не определена');
          }

          return {
            ...feature,
            geometry
          };
        })
    );

    this.clearDraft();

    const olFeatures = wfsFeaturesToOlFeatures(featuresInOlProjection);

    this.addFeatures(olFeatures);
  }

  // Обновим "выделенные фичи" "измененными"
  async highlightMoreFeatures(modifiedFeatures: WfsFeature[]) {
    const selectedFeatures = selectedFeaturesStore.features;
    for (const modifiedFeature of modifiedFeatures) {
      const existingFeatureIndex = selectedFeatures.findIndex(f => f.id === modifiedFeature.id);
      if (existingFeatureIndex === -1) {
        selectedFeatures.push(modifiedFeature);
      } else {
        selectedFeatures[existingFeatureIndex] = modifiedFeature;
      }
    }

    await this.highlightFeatures(selectedFeatures);
  }

  // Очистить карту от слоя, который отображал объект.
  clearDraft() {
    const collection = this.source.getFeaturesCollection();
    const count = collection ? collection.getLength() : 0;
    this.source.clear(count > 10);
  }

  addFeatures(features: Feature<Geometry>[]) {
    this.source.addFeatures(features);
  }

  removeFeature(feature: Feature<Geometry>) {
    this.source.removeFeature(feature);
  }

  showSelectionMarker(coordinates: Coordinate[][][]) {
    if (!this.source) {
      throw new Error('Невозможно отобразить рамку выделения, нет соответствующего слоя');
    }

    const feature: WfsFeature = {
      type: 'Feature',
      geometry: {
        type: GeometryType.MULTI_POLYGON,
        coordinates
      },
      id: '',
      geometry_name: '',
      properties: {}
    };

    const olFeature = wfsFeatureToFeature(feature);
    if (olFeature) {
      this.source.addFeature(olFeature);

      setTimeout(() => {
        try {
          this.source?.removeFeature(olFeature);
        } catch {}
      }, 200);
    }
  }

  getDrawSource(): VectorSource {
    return this.source;
  }
}

export const mapDrawService = MapDrawService.instance;
