import { action, makeObservable, observable } from 'mobx';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry } from 'ol/geom';

import { projectionsStore } from '../../../stores/Projections.store';
import { GeometryType, WfsFeature, WfsGeometry } from '../../geoserver/wfs/wfs.models';
import { isGeometryValid } from '../../geoserver/wfs/wfs.util';
import { services } from '../../services';
import { transformGeometry } from '../../util/coordinates-transform.util';
import { wfsFeatureToFeature } from '../../util/open-layers.util';
import { editFeatureStore } from '../a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../draw/map-draw.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';

interface HighlightState {
  activeVertex: Coordinate | null;
  activeGroup: Coordinate[] | null;
}

class CoordinateHighlightService {
  @observable private highlightState: HighlightState = {
    activeVertex: null,
    activeGroup: null
  };

  private vertexMarker: Feature<Geometry> | null = null;
  private groupMarker: Feature<Geometry> | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  setActiveVertex(coordinate: Coordinate | null): void {
    this.highlightState.activeVertex = coordinate ?? null;

    this.updateHighlight();
  }

  @action
  setActiveGroup(group: Coordinate[] | null): void {
    this.highlightState.activeGroup = group ?? null;
    this.updateHighlight();
  }

  private updateHighlight(): void {
    this.clearMarkers();

    const resultGroup: Coordinate[] = [];

    if (this.highlightState.activeVertex) {
      resultGroup.push(this.highlightState.activeVertex);
    }

    if (this.highlightState.activeGroup && this.highlightState.activeGroup.length > 0) {
      resultGroup.push(...this.highlightState.activeGroup);
    }

    this.showGroupHighlight(resultGroup);
  }

  private showGroupHighlight(coordinates: Coordinate[]): void {
    const groupGeometry = {
      type: GeometryType.MULTI_POINT,
      coordinates: coordinates
    } as WfsGeometry;

    if (!(isGeometryValid(groupGeometry) && projectionsStore.olProjection && editFeatureStore.currentProjection)) {
      services.logger.warn('Не смогли подсветить вершины');

      return;
    }

    const wfsFeature: WfsFeature = {
      type: 'Feature',
      geometry: transformGeometry(groupGeometry, editFeatureStore.currentProjection, projectionsStore.olProjection),
      id: '',
      geometry_name: '',
      properties: {}
    };
    const olFeature = wfsFeatureToFeature(wfsFeature);
    if (olFeature && typeof olFeature.setStyle === 'function') {
      olFeature.setStyle(getStyle(KnownStyleKey.SelectedSingleCoordStyles));
      mapDrawService.addFeatures([olFeature as Feature<Geometry>]);
      this.groupMarker = olFeature as Feature<Geometry>;
    }
  }

  private clearMarkers(): void {
    if (this.vertexMarker) {
      try {
        mapDrawService.removeFeature(this.vertexMarker);
      } catch {
        // Игнорируем ошибки при удалении
      }
      this.vertexMarker = null;
    }

    if (this.groupMarker) {
      try {
        mapDrawService.removeFeature(this.groupMarker);
      } catch {
        // Игнорируем ошибки при удалении
      }
      this.groupMarker = null;
    }
  }
}

export const coordinateHighlightService = new CoordinateHighlightService();
