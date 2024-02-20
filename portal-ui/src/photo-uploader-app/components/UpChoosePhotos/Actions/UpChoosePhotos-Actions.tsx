import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { FileInput } from '../../../../app/components/FileInput/FileInput';
import { konfirmieren } from '../../../../app/services/utility-dialogs.service';
import { Button } from '../../../../app/components/Button/Button';
import { photoUploaderStore } from '../../../stores/PhotoUploader.store';
import { UploadedFile } from '../../UpPreviewer/Item/UpPreviewer-Item';

import '!style-loader!css-loader!sass-loader!./UpChoosePhotos-Actions.scss';

const cnUpChoosePhotosActions = cn('UpChoosePhotos', 'Actions');

export const UpChoosePhotoActions: FC = observer(() => {
  const addHandler = useCallback((files: FileList | null) => {
    if (files?.length) {
      const uploadedFiles: UploadedFile[] = [...files].map(file => ({
        title: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      photoUploaderStore.addUploadedFiles(uploadedFiles);
    }
  }, []);

  const clearHandler = useCallback(async () => {
    if (
      await konfirmieren({
        title: 'Вы уверены, что хотите очистить все добавленные фотографии?'
      })
    ) {
      photoUploaderStore.clearUploadedFiles();
    }
  }, []);

  return (
    <div className={cnUpChoosePhotosActions()}>
      <FileInput
        onChange={addHandler}
        nameHidden
        multiple
        buttonCaption={photoUploaderStore.files.length ? 'Добавить' : 'Выбрать'}
      />
      {!!photoUploaderStore.files.length && <Button onClick={clearHandler}>Очистить</Button>}
    </div>
  );
});
