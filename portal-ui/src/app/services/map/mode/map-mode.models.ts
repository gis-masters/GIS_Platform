import { type SearchInfo } from '../../../components/SearchField/SearchField';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { type CrgExternalLayer, type CrgVectorableLayer } from '../../gis/layers/layers.models';
import { type MapMode } from '../map.models';
import { type SelectedFeaturesData } from '../selection/map-selection.models';

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

export interface EditFeaturesData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  layer?: CrgVectorableLayer | CrgExternalLayer;
}

export interface ModeProps {
  payload: EditFeaturesData | SelectedFeaturesData | SearchInfo | undefined;
}

export interface MapModeHandler {
  activate(props?: ModeProps): Promise<void>;

  deactivate(newMode?: MapMode): Promise<void>;

  /**
   * Идентификатор режима.
   */
  mode(): MapMode;

  /**
   * Признак наличия изменений внесенных пользователем.
   *
   * @returns Возвращает true, если пользователь еще не изменял данные.
   */
  pristine(): boolean;
}
