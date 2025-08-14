import React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Projection } from '../../services/data/projections/projections.models';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { Actions } from '../Actions/Actions.composed';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { OrgProjectionsActionsDelete } from './Delete/OrgProjectionsActions-Delete';
import { OrgProjectionsActionsEdit } from './Edit/OrgProjectionsActions-Edit';

export const cnOrgProjectionsActions = cn('OrgProjectionsActions');

export interface OrgProjectionsActionsProps {
  rowData: Projection;
  filterActive: boolean;
  filterParams: FilterQuery;
  as?: ActionsItemVariant;
}

export const OrgProjectionsActions = observer(({ rowData, as = 'menu' }: OrgProjectionsActionsProps) => {
  if (rowData.authSrid < 200_000 || rowData.authSrid > 900_000) {
    return null;
  }

  return (
    <Actions className={cnOrgProjectionsActions()} as={as}>
      <OrgProjectionsActionsEdit projection={rowData} as={as} />
      <OrgProjectionsActionsDelete projection={rowData} as={as} />
    </Actions>
  );
});
