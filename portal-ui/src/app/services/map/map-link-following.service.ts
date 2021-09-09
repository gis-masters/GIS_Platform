import { currentProject } from '../../stores/CurrentProject.store';
import { route } from '../../stores/Route.store';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { WfsFeature } from '../geoserver/wfs.models';
import { getFeaturesById } from '../geoserver/wfs.service';
import { mapService } from './map.service';

export const MAP_QUERY_PARAMS_DELIMITER = '~';

export interface FeatureError {
  id: string;
  layerTitle: string;
  message: string;
}

class MapLinkFollowing {
  private static _instance: MapLinkFollowing;

  private queryParams: { [key: string]: string };
  private featuresInLayers: Record<string, string[]> = {};
  private featuresWithNoAccess: FeatureError[] = [];
  private deletedLayers: FeatureError[] = [];
  private deletedFeatures: FeatureError[] = [];
  private features: WfsFeature[] = [];
  featuresWithErrors: number;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  async setQueryParams() {
    this.queryParams = route.queryParams as { [key: string]: string };

    await this.setLayers();
  }

  private async setLayers() {
    if (this.queryParams.features) {
      this.queryParams.features.split(',').forEach(feature => {
        const [featureId, workspace] = feature.split(MAP_QUERY_PARAMS_DELIMITER);

        if (!this.featuresInLayers[workspace]) {
          this.featuresInLayers[workspace] = [featureId];
        } else {
          this.featuresInLayers[workspace].push(featureId);
        }
      });

      for (const key in this.featuresInLayers) {
        const featureLayer = currentProject.vectorLayers.find(layer => layer.tableName === key.split(':')[1]);

        if (featureLayer) {
          const layerFeatures = await getFeaturesById(this.featuresInLayers[key], key);

          const deletedFeatures = this.featuresInLayers[key].filter(
            feature => !layerFeatures.map(item => item.id).includes(feature)
          );

          if (deletedFeatures.length) {
            deletedFeatures.forEach(feature => {
              const layer = currentProject.vectorLayers.find(layer => layer.complexName === key);
              this.deletedFeatures.push({
                id: feature.split('.')[1],
                layerTitle: layer.title,
                message: 'Объект удален'
              });
            });
          }

          this.features = [...this.features, ...layerFeatures];
        } else {
          const layerInProject = currentProject.layers.find(layer => layer.tableName === key.split(':')[1]);

          if (layerInProject) {
            this.featuresInLayers[key].forEach(feature => {
              this.featuresWithNoAccess.push({
                id: feature.split('.')[1],
                layerTitle: layerInProject.title,
                message: 'Слой недоступен'
              });
            });
          } else {
            this.featuresInLayers[key].forEach(feature => {
              this.deletedLayers.push({
                id: feature.split('.')[1],
                layerTitle: key.split(':')[1],
                message: 'Слой удален'
              });
            });
          }
        }
      }
    }

    sidebars.setDeletedFeatures(this.deletedFeatures);
    sidebars.setNoAccessFeatures(this.featuresWithNoAccess);
    sidebars.setDeletedLayers(this.deletedLayers);

    this.featuresWithErrors =
      this.deletedFeatures.length + this.featuresWithNoAccess.length + this.deletedLayers.length;
    sidebars.setFeaturesWithErrors(this.featuresWithErrors);

    this.showFeatures();
  }

  private showFeatures() {
    mapService.highlightFeatures(this.features);

    if (this.features.length === 1 && !this.featuresWithErrors) {
      sidebars.openEdit({
        features: this.features,
        mode: EditFeatureMode.single
      });
      setTimeout(() => {
        mapService.positionToFeature(this.features[0]);
      }, 200);
    } else if ((this.features.length === 1 && this.featuresWithErrors) || this.features.length > 1) {
      sidebars.openFeatures(this.features);
    } else if ((!this.features.length && this.featuresWithErrors) || this.features.length > 1) {
      sidebars.openFeaturesWithError();
    }
  }
}

export const mapLinkFollowing = MapLinkFollowing.instance;
