import React, { ReactNode } from 'react';
import { ViewListOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { VectorTable } from '../../../../services/data/vectorData/vectorData.models';
import { VectorTableActions } from '../../../VectorTableActions/VectorTableActions';
import { staticImplements } from '../../../../services/util/staticImplements';
import { formatDate } from '../../../../services/util/date.util';
import { services } from '../../../../services/services';

import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { GeometryIcon } from '../../../GeometryIcon/GeometryIcon';

@staticImplements<Adapter<VectorTable>>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<VectorTable>): string {
    return item.payload.identifier;
  }

  static getTitle(item: ExplorerItemData<VectorTable>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<VectorTable>): ReactNode {
    const { details, createdAt } = item.payload;

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {formatDate(createdAt, 'LL')}
          </ExplorerInfoDescItem>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<VectorTable>): string {
    return item.payload.identifier;
  }

  static getIcon(item: ExplorerItemData<VectorTable>): ReactNode {
    return <GeometryIcon geometryType={item.payload.schema.geometryType} colorized />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData<VectorTable>): ReactNode {
    return <VectorTableActions vectorTable={item.payload} />;
  }

  static customOpenActionIcon(): ReactNode {
    return (
      <Tooltip title='Перейти в табличный вид'>
        <ViewListOutlined />
      </Tooltip>
    );
  }

  static async customOpenAction(item: ExplorerItemData<VectorTable>): Promise<void> {
    await services.provided;

    services.ngZone.run(() => {
      setTimeout(() => {
        void services.router.navigateByUrl(
          `/data-management/dataset/${item.payload.dataset}/vectorTable/${item.payload.identifier}/registry`
        );
      }, 0);
    });
  }
}
