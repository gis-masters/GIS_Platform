import { compose, composeU } from '@bem-react/core';

import { ExplorerInfo as ExplorerInfoPresenter } from './Explorer-Info';
import { withExplorerInfoTypeDataTable } from './_type/Explorer-Info_type_dataTable';
import { withExplorerInfoTypeBasemap } from './_type/Explorer-Info_type_basemap';

export const ExplorerInfo = compose(composeU(withExplorerInfoTypeDataTable, withExplorerInfoTypeBasemap))(
  ExplorerInfoPresenter
);
