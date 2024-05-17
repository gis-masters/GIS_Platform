import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Projection, projectionXTableCols } from '../../services/data/projection/projection.models';
import { getProjection } from '../../services/data/projection/projection.service';
import { PageOptions } from '../../services/models';
import { XTable } from '../XTable/XTable';
import { OrgProjectionCreate } from './Create/OrgProjection-Create';

import '!style-loader!css-loader!sass-loader!./OrgProjection.scss';

const cnOrgProjection = cn('OrgProjection');

@observer
export class OrgProjection extends Component {
  render() {
    return (
      <XTable
        className={cnOrgProjection()}
        headerActions={<OrgProjectionCreate />}
        getData={this.getProjection}
        cols={projectionXTableCols}
        defaultSort={{ field: 'authSrid', asc: true }}
        getRowId={this.getProjectionId}
        filterable
        showFiltersPanel
        filtersAlwaysEnabled
      />
    );
  }

  private async getProjection(pageOptions: PageOptions): Promise<[Projection[], number]> {
    const [Projection, totalPages] = await getProjection(pageOptions);

    return [Projection, totalPages];
  }

  private getProjectionId(rowData: Projection): string {
    return rowData.authName + String(rowData.authSrid);
  }
}
