import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { projectionXTableCols } from '../../services/data/projections/projections.models';
import { getProjections } from '../../services/data/projections/projections.service';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { XTable } from '../XTable/XTable';
import { OrgProjectionsCreate } from './Create/OrgProjections-Create';

import '!style-loader!css-loader!sass-loader!./OrgProjections.scss';

const cnOrgProjections = cn('OrgProjections');

export const OrgProjections: FC = observer(() => (
  <XTable
    className={cnOrgProjections()}
    headerActions={<OrgProjectionsCreate />}
    getData={getProjections}
    cols={projectionXTableCols}
    defaultSort={{ field: 'authSrid', asc: true }}
    getRowId={getProjectionCode}
    filterable
    showFiltersPanel
    filtersAlwaysEnabled
  />
));
