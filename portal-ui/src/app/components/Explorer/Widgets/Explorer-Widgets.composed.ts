import { compose, HOC } from '@bem-react/core';

import { withTypeBasemap } from './_type/Explorer-Widgets_type_basemap';
import { withTypeDataset } from './_type/Explorer-Widgets_type_dataset';
import { withTypeDocument } from './_type/Explorer-Widgets_type_document';
import { withTypeDocumentVersion } from './_type/Explorer-Widgets_type_documentVersion';
import { withTypeFolder } from './_type/Explorer-Widgets_type_folder';
import { withTypeLibrary } from './_type/Explorer-Widgets_type_library';
import { withTypeProject } from './_type/Explorer-Widgets_type_project';
import { withTypeProjectFolder } from './_type/Explorer-Widgets_type_projectFolder';
import { withTypeSchema } from './_type/Explorer-Widgets_type_schema';
import { withTypeSearchItem } from './_type/Explorer-Widgets_type_searchItem';
import { withTypeTable } from './_type/Explorer-Widgets_type_table';
import { withTypeTaskHistory } from './_type/Explorer-Widgets_type_taskHistory';
import { ExplorerWidgetsBase, ExplorerWidgetsProps } from './Explorer-Widgets.base';

export const ExplorerWidgets = compose(
  withTypeBasemap as HOC<ExplorerWidgetsProps>,
  withTypeDataset as HOC<ExplorerWidgetsProps>,
  withTypeDocument as HOC<ExplorerWidgetsProps>,
  withTypeFolder as HOC<ExplorerWidgetsProps>,
  withTypeLibrary as HOC<ExplorerWidgetsProps>,
  withTypeSchema as HOC<ExplorerWidgetsProps>,
  withTypeTable as HOC<ExplorerWidgetsProps>,
  withTypeSearchItem as HOC<ExplorerWidgetsProps>,
  withTypeDocumentVersion as HOC<ExplorerWidgetsProps>,
  withTypeTaskHistory as HOC<ExplorerWidgetsProps>,
  withTypeProject as HOC<ExplorerWidgetsProps>,
  withTypeProjectFolder as HOC<ExplorerWidgetsProps>
)(ExplorerWidgetsBase) as typeof ExplorerWidgetsBase;
