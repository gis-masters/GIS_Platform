import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { List } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CopyUrlButton } from '../../../app/components/CopyUrlButton/CopyUrlButton';
import { IconButton } from '../../../app/components/IconButton/IconButton';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpLayersListItem } from '../UpLayersList/Item/UpLayersList-Item';

import '!style-loader!css-loader!sass-loader!./UpSelectedLayer.scss';
import '!style-loader!css-loader!sass-loader!./DataType/UpSelectedLayer-DataType.scss';
import '!style-loader!css-loader!sass-loader!./Title/UpSelectedLayer-Title.scss';
import '!style-loader!css-loader!sass-loader!./Icon/UpSelectedLayer-Icon.scss';

const cnUpSelectedLayer = cn('UpSelectedLayer');

export const UpSelectedLayer: FC<{ atResultsScreen?: boolean }> = observer(({ atResultsScreen }) => {
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
            atResultsScreen ? (
              <CopyUrlButton vectorTable={photoUploaderStore.checkedLayer.data} />
            ) : (
              <IconButton className={cnUpSelectedLayer('Button')} onClick={removeCheckedLayer} size='large'>
                <Clear />
              </IconButton>
            )
          }
        />
      )}
    </List>
  );
});
