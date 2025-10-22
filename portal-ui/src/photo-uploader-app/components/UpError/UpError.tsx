import React, { type FC } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { cn } from '@bem-react/classname';

import { photoUploaderStore } from '../../stores/PhotoUploader.store';

import './UpError.scss';

const cnUpError = cn('UpError');

interface UpErrorProps {
  message?: string;
}

export const UpError: FC<UpErrorProps> = ({ message }) => (
  <div className={cnUpError()}>
    {message}
    <List className={cnUpError('List')}>
      {photoUploaderStore.errors.map((item, idx) => (
        <ListItem className={cnUpError('ListItem')} key={idx}>
          <ListItemText>{item}</ListItemText>
        </ListItem>
      ))}
    </List>
  </div>
);
