import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { FormViewValue } from '../../../Form/ViewValue/Form-ViewValue';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerItemType } from '../../Explorer.models';

const ExplorerWidgetsTypeSchema: FC<ExplorerWidgetsProps> = observer(({ className, item }) => {
  return (
    <div className={cnExplorerWidgets(null, [className])}>
      <ExplorerInfoDescItem multiline>
        <FormViewValue code>{JSON.stringify(item.payload, null, 2)}</FormViewValue>
      </ExplorerInfoDescItem>
    </div>
  );
});

export const withTypeSchema = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.SCHEMA },
  () => ExplorerWidgetsTypeSchema
);
