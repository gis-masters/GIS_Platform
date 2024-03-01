import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { FileInput } from '../../../../app/components/FileInput/FileInput';
import { konfirmieren } from '../../../../app/services/utility-dialogs.service';
import { Button } from '../../../../app/components/Button/Button';
import { photoUploaderStore } from '../../../stores/PhotoUploader.store';
import { UploadedFile } from '../../UpPreviewer/Item/UpPreviewer-Item';

import '!style-loader!css-loader!sass-loader!./UpChoosePhotos-Actions.scss';
import { Toast } from 'src/app/components/Toast/Toast';
import { pluralize } from 'numeralize-ru';

const cnUpChoosePhotosActions = cn('UpChoosePhotos', 'Actions');

const addHandler = (files: FileList | null) => {
  if (files?.length) {
    const uploadedFiles: UploadedFile[] = [...files]
      .map(file => ({
        title: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
      .filter(file => photoUploaderStore.files.every(item => item.title !== file.title && item.size !== file.size));

    if (files.length !== uploadedFiles.length) {
      const startInfo = `Добавлен${pluralize(uploadedFiles.length, '', 'о', 'о')} ${uploadedFiles.length} из `;
      const endInfo = `${files.length} файл${pluralize(files.length, 'а', 'ов', 'ов')}. `;
      const addInfo = 'Дубликаты недоступны к загрузке';

      Toast.warn(startInfo + endInfo + addInfo);
    }

    photoUploaderStore.addUploadedFiles(uploadedFiles);
  }
};

const clearHandler = async () => {
  if (
    await konfirmieren({
      message: 'Вы уверены, что хотите удалить из списка все добавленные фотографии?'
    })
  ) {
    photoUploaderStore.clearUploadedFiles();
  }
};

export const UpChoosePhotoActions: FC = observer(() => (
  <div className={cnUpChoosePhotosActions()}>
    <FileInput
      onChange={addHandler}
      nameHidden
      multiple
      accept='image/*'
      buttonCaption={photoUploaderStore.files.length ? 'Добавить' : 'Выбрать'}
    />
    {!!photoUploaderStore.files.length && <Button onClick={clearHandler}>Очистить</Button>}
  </div>
));
