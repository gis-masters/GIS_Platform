import React, { FC, ReactNode } from 'react';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { observer } from 'mobx-react';

import { cn } from '@bem-react/classname';

import { getCoordinatesByFeature } from '../../services/photoUploader.service';
import { UploadedFile } from '../../services/photoUploader.models';

import '!style-loader!css-loader!sass-loader!./Title/UpLoadItem-Title.scss';
import '!style-loader!css-loader!sass-loader!./Image/UpLoadItem-Image.scss';

export type UpPhotoLoadListItemProps = {
  item: UploadedFile;
  actions?: ReactNode;
};

const cnUpLoadItem = cn('UpLoadItem');

export const UpLoadItem: FC<UpPhotoLoadListItemProps> = observer(({ item: { title, size, url, feature }, actions }) => {
  return (
    <ListItem className={cnUpLoadItem()} secondaryAction={actions}>
      <ListItemAvatar>
        <img className={cnUpLoadItem('Image')} src={url} alt={title} />
      </ListItemAvatar>
      <ListItemText
        primary={<div className={cnUpLoadItem('Title')}>{title}</div>}
        primaryTypographyProps={feature.geometry?.coordinates?.length ? undefined : { color: 'error' }}
        secondary={
          <>
            <div className={cnUpLoadItem('Coordinates')}>
              {getCoordinatesByFeature(feature) || 'Координаты отсутствуют'}
            </div>
            <div className={cnUpLoadItem('Size')}>{`${Math.ceil(size / 1024)} КБ`}</div>
          </>
        }
        secondaryTypographyProps={feature.geometry?.coordinates?.length ? undefined : { color: 'error' }}
      />
    </ListItem>
  );
});
