import { withBemMod } from '@bem-react/core';

import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerWidgetsTypeLibraryRecord } from './Explorer-Widgets_type_libraryRecord';

export const withTypeDocument = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.DOCUMENT },
  () => ExplorerWidgetsTypeLibraryRecord
);
