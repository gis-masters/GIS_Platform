import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema.models';
import { formatDate } from '../../services/util/date.util';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { VectorTable, vectorTableSchema } from '../../services/data/data.service';

import '!style-loader!css-loader!sass-loader!./VectorTableCard.scss';

const cnVectorTableCard = cn('VectorTableCard');

interface VectorTableCardProps {
  vectorTable?: VectorTable;
}

@observer
export class VectorTableCard extends Component<VectorTableCardProps> {
  render() {
    const { vectorTable } = this.props;

    return (
      <div className={cnVectorTableCard()}>
        {vectorTable && (
          <>
            <div className={cnVectorTableCard('Date')}>
              <span className={cnVectorTableCard('DateTitle')}>Дата создания:</span>
              {formatDate(vectorTable.createdAt, 'LL')}
            </div>

            <div className={cnVectorTableCard('Card')}>
              {vectorTable && (
                <ViewContentWidget
                  schema={vectorTableSchema as unknown as Schema}
                  data={vectorTable as unknown as Record<string, unknown>}
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}
