import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { pluralize } from 'numeralize-ru';

import { FileInput, FileInputProps } from '../../../app/components/FileInput/FileInput';
import { Toast } from '../../../app/components/Toast/Toast';
import { UploadedFile } from '../../services/photoUploader.models';
import { getFilesInfoByFileList } from '../../services/photoUploader.service';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';

const addHandler = async (checkedFiles: FileList | null) => {
  const files: File[] = [...(checkedFiles || [])].filter(item => item.type !== '' && item.type.startsWith('image/'));

  if (files?.length) {
    const firstHandledFiles: UploadedFile[] = await getFilesInfoByFileList(files);

    const uploadedFiles: UploadedFile[] = firstHandledFiles.filter(file =>
      photoUploaderStore.files.every(item => item.title !== file.title && item.size !== file.size)
    );

    if (files.length !== uploadedFiles.length) {
      const startInfo = `Добавлен${pluralize(uploadedFiles.length, '', 'о', 'о')} ${uploadedFiles.length} из `;
      const endInfo = `${files.length} файл${pluralize(files.length, 'а', 'ов', 'ов')}. `;
      const addInfo = 'Дубликаты недоступны к загрузке';

      Toast.warn(startInfo + endInfo + addInfo);
    }

    photoUploaderStore.addUploadedFiles(uploadedFiles);
  }
};

const cnUpAddFiles = cn('UpAddFiles');

export const UpAddFiles: FC<Pick<FileInputProps, 'buttonCaption' | 'buttonProps'>> = ({
  buttonProps,
  buttonCaption
}) => (
  <FileInput
    className={cnUpAddFiles()}
    onChange={addHandler}
    nameHidden
    multiple
    accept='image/*'
    buttonCaption={buttonCaption}
    buttonProps={buttonProps}
  />
);
