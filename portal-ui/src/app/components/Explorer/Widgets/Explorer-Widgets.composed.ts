import { compose } from '@bem-react/core';

import { ExplorerWidgetsBase } from './Explorer-Widgets.base';
import { withTypeBasemap } from './_type/Explorer-Widgets_type_basemap';
import { withTypeDataset } from './_type/Explorer-Widgets_type_dataset';
import { withTypeDocument } from './_type/Explorer-Widgets_type_document';
import { withTypeFolder } from './_type/Explorer-Widgets_type_folder';
import { withTypeLibrary } from './_type/Explorer-Widgets_type_library';
import { withTypeSchema } from './_type/Explorer-Widgets_type_schema';
import { withTypeTable } from './_type/Explorer-Widgets_type_table';

export const ExplorerWidgets = compose(
  withTypeBasemap,
  withTypeDataset,
  withTypeDocument,
  withTypeFolder,
  withTypeLibrary,
  withTypeSchema,
  withTypeTable
)(ExplorerWidgetsBase) as typeof ExplorerWidgetsBase;
