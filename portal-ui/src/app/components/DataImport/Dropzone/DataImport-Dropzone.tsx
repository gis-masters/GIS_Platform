import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import Dropzone from 'react-dropzone';

import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./DataImport-Dropzone.scss';

const cnDataImport = cn('DataImport');

interface DataImportDropzoneProps {
  loading: boolean;
  file?: File;
  importOn: boolean;
  onDrop(files: File[]): void;
  onClear(): void;
}

export const DataImportDropzone: FC<DataImportDropzoneProps> = props => {
  const { file, loading, onDrop, onClear, importOn } = props;
  let fileSize: number | null = null;
  if (file) {
    fileSize = file.size / 1024 / 1024;
    if (fileSize < 0.001) {
      fileSize = 0.001;
    }
  }

  const emptyFile = !file && importOn;

  return (
    <div className={cnDataImport('Dropzone')}>
      <Dropzone onDrop={onDrop} preventDropOnDocument disabled={loading || Boolean(file)}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className={cnDataImport('DropzoneControl', { fileOver: isDragActive })} {...getRootProps()}>
            <div className={cnDataImport('DropzoneCaption')}>
              Перетащите zip архив с shape файлами
              <br />
              или
              <br />
              <Button variant='contained' className={cnDataImport('DropzoneButton')}>
                Откройте проводник для выбора файла
              </Button>
            </div>

            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
      {file || emptyFile ? (
        <div className={cnDataImport('DropzoneFiles')}>
          <div className={cnDataImport('DropzoneFile')}>
            <div className={cnDataImport('DropzoneFileName')}>{emptyFile ? 'Загруженный файл' : file?.name}</div>
            {!emptyFile && fileSize && (
              <div className={cnDataImport('DropzoneFileSize')}>{Number(fileSize.toFixed(3))} MB</div>
            )}
            <IconButton className={cnDataImport('DropzoneFileDel')} onClick={onClear}>
              <Delete color='error' />
            </IconButton>
          </div>
        </div>
      ) : null}
      <Loading visible={loading} />
    </div>
  );
};
