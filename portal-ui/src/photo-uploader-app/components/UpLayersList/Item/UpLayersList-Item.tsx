import React, { FC, PropsWithChildren, useCallback } from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { VectorTable } from '../../../../app/services/data/vectorData/vectorData.models';
import { GeometryIcon } from '../../../../app/components/GeometryIcon/GeometryIcon';
import { photoUploaderStore } from '../../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpLayersList-Item.scss';
import '!style-loader!css-loader!sass-loader!../ItemTitle/UpLayersList-ItemTitle.scss';
import '!style-loader!css-loader!sass-loader!../DataType/UpLayersList-DataType.scss';

export interface UpLayersListItemData {
  data: VectorTable;
}

type UpLayerListItemProps = UpLayersListItemData & PropsWithChildren & { type: 'button' | 'simple' };

const cnUpLayersList = cn('UpLayersList');

const dataType = 'Векторная таблица';

export const UpLayersListItem: FC<UpLayerListItemProps> = observer(({ data, type, children }) => {
  const onClickHandler = useCallback(() => {
    photoUploaderStore.setCheckedLayer({ data });
    photoUploaderStore.closeLayersList();
  }, [data]);

  return (
    <>
      {type === 'button' ? (
        <ListItemButton className={cnUpLayersList('Item')} onClick={onClickHandler}>
          <ListItemIcon>
            <GeometryIcon geometryType={data.schema.geometryType} colorized />
          </ListItemIcon>
          <ListItemText primary={data.title} secondary={dataType} />
          {children}
        </ListItemButton>
      ) : (
        <ListItem className={cnUpLayersList('Item')}>
          <ListItemIcon>
            <GeometryIcon geometryType={data.schema.geometryType} colorized />
          </ListItemIcon>
          <ListItemText primary={data.title} secondary={dataType} />
          {children}
        </ListItem>
      )}
    </>
  );
});
