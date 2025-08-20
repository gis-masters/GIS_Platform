import { SearchInfo } from '../../../components/SearchField/SearchField';
import { MapMode } from '../map.models';
import { EditFeaturesData } from './edit-feature/EditFeature.models';
import { SelectedFeaturesData } from './selected-features/selectedFeatures.models';
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
