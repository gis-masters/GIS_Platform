import React, { FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';
import { KeyboardBackspace } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { photoUploaderStore } from '../../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpHeader-ReturnButton.scss';

const cnUpHeaderReturnButton = cn('UpHeader', 'ReturnButton');

export const UpHeaderReturnButton: FC = () => {
  const clickHadler = useCallback(() => {
    photoUploaderStore.closeLayersList();
  }, []);

  return (
    <IconButton className={cnUpHeaderReturnButton()} onClick={clickHadler}>
      <KeyboardBackspace />
    </IconButton>
  );
};
