import React, { FC, useCallback } from 'react';
import { List } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../../app/components/IconButton/IconButton';
import { UpLayersListItem } from '../UpLayersList/Item/UpLayersList-Item';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpSelectedLayer.scss';
import '!style-loader!css-loader!sass-loader!./DataType/UpSelectedLayer-DataType.scss';
import '!style-loader!css-loader!sass-loader!./Title/UpSelectedLayer-Title.scss';
import '!style-loader!css-loader!sass-loader!./Icon/UpSelectedLayer-Icon.scss';

const cnUpSelectedLayer = cn('UpSelectedLayer');

export const UpSelectedLayer: FC = observer(() => {
  const removeCheckedLayer = useCallback(() => {
    photoUploaderStore.setCheckedLayer(null);
  }, []);

  return (
    <List className={cnUpSelectedLayer()}>
      {!!photoUploaderStore.checkedLayer && (
        <UpLayersListItem
          type='simple'
          {...photoUploaderStore.checkedLayer}
          children={
            <IconButton className={cnUpSelectedLayer('Button')} onClick={removeCheckedLayer} size='large'>
              <Clear />
            </IconButton>
          }
        />
      )}
    </List>
  );
});
