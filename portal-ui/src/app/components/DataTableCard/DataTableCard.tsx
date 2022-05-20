import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/crg/schema.models';
import { formatDate } from '../../services/util/date.util';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { DataTable, dataTableSchema } from '../../services/data.service';

import '!style-loader!css-loader!sass-loader!./DataTableCard.scss';

const cnDataTableCard = cn('DataTableCard');

interface DataTableCardProps {
  dataTable?: DataTable;
}

@observer
export class DataTableCard extends Component<DataTableCardProps> {
  render() {
    const { dataTable } = this.props;

    return (
      <div className={cnDataTableCard()}>
        {dataTable && (
          <>
            <div className={cnDataTableCard('Date')}>
              <span className={cnDataTableCard('DateTitle')}>Дата создания:</span>
              {formatDate(dataTable.createdAt, 'LL')}
            </div>

            <div className={cnDataTableCard('Card')}>
              {dataTable && (
                <ViewContentWidget
                  schema={dataTableSchema as unknown as Schema}
                  data={dataTable as unknown as Record<string, unknown>}
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}
