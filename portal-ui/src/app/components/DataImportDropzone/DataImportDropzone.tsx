import React, { type FC, useCallback } from 'react';
import { Delete } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import Dropzone, { type Accept, type FileRejection } from 'react-dropzone';

import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Loading } from '../Loading/Loading';

import './DataImportDropzone.scss';

const cnDataImportDropzone = cn('DataImportDropzone');

const DEFAULT_CAPTION_LINE = 'Перетащите zip архив с shape файлами';

interface DataImportDropzoneProps extends IClassNameProps {
  loading: boolean;
  file?: File;
  importOn: boolean;
  onDrop(files: File[]): void;
  onClear(): void;
  /** Первая строка подсказки над «или» и кнопкой выбора файла */
  captionLine?: string;
  /** Ограничение типов файлов для `input` и drop (см. react-dropzone `accept`) */
  accept?: Accept;
  /** Файлы, отклонённые по `accept` / размеру (см. `react-dropzone` `fileRejections`) */
  onDropRejected?(rejections: FileRejection[]): void;
}

export const DataImportDropzone: FC<DataImportDropzoneProps> = props => {
  const {
    file,
    loading,
    onDrop,
    onDropRejected,
    onClear,
    importOn,
    captionLine = DEFAULT_CAPTION_LINE,
    accept,
    className
  } = props;

  const handleNativeDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length) {
        onDropRejected?.(fileRejections);
      }

      if (acceptedFiles.length) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop, onDropRejected]
  );

  let fileSize: number | null = null;
  if (file) {
    fileSize = file.size / 1024 / 1024;
    if (fileSize < 0.001) {
      fileSize = 0.001;
    }
  }

  const emptyFile = !file && importOn;

  return (
    <div className={cnDataImportDropzone(null, [className])}>
      <Dropzone accept={accept} onDrop={handleNativeDrop} preventDropOnDocument disabled={loading || Boolean(file)}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className={cnDataImportDropzone('Control', { fileOver: isDragActive })} {...getRootProps()}>
            <div className={cnDataImportDropzone('Caption')}>
              {captionLine}
              <br />
              или
              <br />
              <Button variant='contained' className={cnDataImportDropzone('Button')}>
                Откройте проводник для выбора файла
              </Button>
            </div>

            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
      {file || emptyFile ? (
        <div className={cnDataImportDropzone('Files')}>
          <div className={cnDataImportDropzone('File')}>
            <div className={cnDataImportDropzone('FileName')}>{emptyFile ? 'Загруженный файл' : file?.name}</div>
            {!emptyFile && fileSize && (
              <div className={cnDataImportDropzone('FileSize')}>{Number(fileSize.toFixed(3))} MB</div>
            )}
            <IconButton className={cnDataImportDropzone('FileDel')} onClick={onClear}>
              <Delete color='error' />
            </IconButton>
          </div>
        </div>
      ) : null}
      <Loading visible={loading} />
    </div>
  );
};
