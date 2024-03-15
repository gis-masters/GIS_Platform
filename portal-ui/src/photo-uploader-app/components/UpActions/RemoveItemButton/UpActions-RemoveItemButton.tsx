import React, { FC, useCallback } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { observer } from 'mobx-react';

import { konfirmieren } from '../../../../app/services/utility-dialogs.service';
import { photoUploaderStore } from '../../../stores/PhotoUploader.store';
import { IconButton } from '../../../../app/components/IconButton/IconButton';

interface UpActionsRemoveItemButtonProps {
  title: string;
  error?: boolean;
}

export const UpActionsRemoveItemButton: FC<UpActionsRemoveItemButtonProps> = observer(({ title, error }) => {
  const clickHandler = useCallback(async () => {
    if (
      await konfirmieren({
        message: 'Вы уверены, что хотите удалить эту фотографию?'
      })
    ) {
      photoUploaderStore.removeFileByTitle(title);
    }
  }, [title]);

  return (
    <IconButton onClick={clickHandler} color={error ? 'error' : undefined}>
      <DeleteOutline />
    </IconButton>
  );
});
