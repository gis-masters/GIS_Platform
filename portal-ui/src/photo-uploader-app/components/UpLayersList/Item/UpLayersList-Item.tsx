import React, { type FC, type PropsWithChildren, useCallback } from 'react';
import { observer } from 'mobx-react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { cn } from '@bem-react/classname';

import { GeometryIcon } from '../../../../app/components/GeometryIcon/GeometryIcon';
import { type UpLayersListItemData } from '../../../services/photoUploader.models';
import { photoUploaderStore } from '../../../stores/PhotoUploader.store';

import './UpLayersList-Item.scss';
import '../ItemTitle/UpLayersList-ItemTitle.scss';
import '../DataType/UpLayersList-DataType.scss';

type UpLayerListItemProps = UpLayersListItemData & PropsWithChildren & { type: 'button' | 'simple' };

const cnUpLayersList = cn('UpLayersList');

const dataType = 'Векторная таблица';

export const UpLayersListItem: FC<UpLayerListItemProps> = observer(({ data, type, children }) => {
  const onClickHandler = useCallback(() => {
    photoUploaderStore.setCheckedLayer({ data });
    photoUploaderStore.returnToMainScreen();
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
