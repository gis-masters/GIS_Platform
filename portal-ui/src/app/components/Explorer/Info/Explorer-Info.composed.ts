import { compose, composeU } from '@bem-react/core';

import { ExplorerInfo as ExplorerInfoPresenter } from './Explorer-Info';
import { withExplorerInfoTypeDataTable } from './_type/Explorer-Info_type_dataTable';

export const ExplorerInfo = compose(composeU(withExplorerInfoTypeDataTable))(ExplorerInfoPresenter);
