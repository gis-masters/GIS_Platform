import React, { ChangeEvent, FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { TextField, Tooltip } from '@mui/material';
import { SellOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../../app/components/IconButton/IconButton';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';

import '!style-loader!css-loader!sass-loader!./UpTags.scss';

interface UpTagsState {
  isOpen: boolean;
  setOpen(isOpen: boolean): void;
}

const cnUpTags = cn('UpTags');

export const UpTags: FC = observer(() => {
  const { isOpen, setOpen } = useLocalObservable(
    (): UpTagsState => ({
      isOpen: false,
      setOpen(this: UpTagsState, isOpen: boolean): void {
        this.isOpen = isOpen;
      }
    })
  );

  const { labelValue, setLabelValue } = photoUploaderStore;

  const onClick = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setLabelValue(value);
    },
    [setLabelValue]
  );

  return (
    <div className={cnUpTags()}>
      {isOpen && (
        <TextField
          className={cnUpTags('TextField')}
          value={labelValue}
          onChange={onChange}
          variant='standard'
          placeholder='Пометить фотографии'
        />
      )}
      <Tooltip title='Пометить фотографии'>
        <IconButton onClick={onClick}>
          <SellOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
});
