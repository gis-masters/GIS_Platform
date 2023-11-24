import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { Schema } from '../../../../services/data/schema/schema.models';
import { cnExplorerWidgets } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

import { SchemaProperties } from '../../../SchemaProperties/SchemaProperties';

import '!style-loader!css-loader!sass-loader!../../InfoBoxTitle/Explorer-InfoBoxTitle.scss';

const cnExplorerInfoBoxTitle = cn('Explorer', 'InfoBoxTitle');

interface ExplorerWidgetsTypeSchemaProps {
  className: string;
  item: ExplorerItemData<Schema>;
}

const ExplorerWidgetsTypeSchema: FC<ExplorerWidgetsTypeSchemaProps> = observer(({ className, item }) => (
  <div className={cnExplorerWidgets(null, [className])}>
    <span className={cnExplorerInfoBoxTitle()}>Свойства:</span>
    <SchemaProperties schema={item.payload} />
  </div>
));

export const withTypeSchema = withBemMod<ExplorerWidgetsTypeSchemaProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.SCHEMA },
  () => ExplorerWidgetsTypeSchema
);
