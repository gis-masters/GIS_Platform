import React, { ReactNode } from 'react';
import { ViewListOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { VectorTableActions } from '../../../VectorTableActions/VectorTableActions';
import { staticImplements } from '../../../../services/util/staticImplements';
import { formatDate } from '../../../../services/util/date.util';
import { services } from '../../../../services/services';

import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { GeometryIcon } from '../../../GeometryIcon/GeometryIcon';

export function assertExplorerItemDataTypeTable(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.TABLE] {
  if (item.type !== ExplorerItemType.TABLE) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeTable(item);

    return item.payload.identifier;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeTable(item);

    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeTable(item);

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

  static getMeta = ExplorerAdapterTypeTable.getId;

  static getIcon(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeTable(item);

    return <GeometryIcon geometryType={item.payload.schema.geometryType} colorized />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeTable(item);

    return <VectorTableActions vectorTable={item.payload} />;
  }

  static customOpenActionIcon(): ReactNode {
    return (
      <Tooltip title='Перейти в табличный вид'>
        <ViewListOutlined />
      </Tooltip>
    );
  }

  static async customOpenAction(item: ExplorerItemData): Promise<void> {
    assertExplorerItemDataTypeTable(item);

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
