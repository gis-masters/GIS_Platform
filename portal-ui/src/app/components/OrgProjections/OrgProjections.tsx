import React, { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { communicationService } from '../../services/communication.service';
import { Projection, projectionXTableCols } from '../../services/data/projections/projections.models';
import { getProjections } from '../../services/data/projections/projections.service';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { OrgProjectionsActions } from '../OrgProjectionsActions/OrgProjectionsActions';
import { XTable, XTableInvoke } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { OrgProjectionsCreate } from './Create/OrgProjections-Create';

import '!style-loader!css-loader!sass-loader!./OrgProjections.scss';

const cnOrgProjections = cn('OrgProjections');

export const OrgProjections: FC = observer(() => {
  const tableInvoke = useRef<XTableInvoke>({});

  useEffect(() => {
    const handleProjectionUpdate = async () => {
      if (tableInvoke.current.reload) {
        await tableInvoke.current.reload();
      }
    };

    communicationService.projectionUpdated.on(handleProjectionUpdate);

    return () => {
      communicationService.off(handleProjectionUpdate);
    };
  }, []);

  const projectionXTableColsWithActions: XTableColumn<Projection>[] = [
    {
      title: '',
      width: 50,
      cellProps: { padding: 'none' },
      headerCellProps: { padding: 'none' },
      CellContent: OrgProjectionsActions
    },
    ...projectionXTableCols
  ];

  return (
    <XTable<Projection>
      className={cnOrgProjections()}
      headerActions={<OrgProjectionsCreate />}
      getData={getProjections}
      cols={projectionXTableColsWithActions}
      defaultSort={{ field: 'auth_srid', asc: true }}
      getRowId={getProjectionCode}
      filterable
      showFiltersPanel
      filtersAlwaysEnabled
      invoke={tableInvoke.current}
    />
  );
});
