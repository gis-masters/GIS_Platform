import { type SearchInfo } from '../../../components/SearchField/SearchField';
import { type MapMode } from '../map.models';
import { type EditFeaturesData } from './edit-feature/EditFeature.models';
import { type SelectedFeaturesData } from './selected-features/selectedFeatures.models';
export interface ModeProps {
  payload: EditFeaturesData | SelectedFeaturesData | SearchInfo | undefined;
}

export interface IMapModeHandler {
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
