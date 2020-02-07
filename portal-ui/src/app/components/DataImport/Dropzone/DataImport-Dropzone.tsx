import React from 'react';
import Dropzone from 'react-dropzone'
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { cn } from '@bem-react/classname';

import { Loading } from '../../Loading/Loading';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./DataImport-Dropzone.scss';

const cnDataImport = cn('DataImport');

interface DataImportDropzoneProps {
  loading: boolean;
  file: File;
  importOn: boolean;
  onDrop: (files: File[]) => void;
  onClear: () => void;
}

export const DataImportDropzone: React.FC<DataImportDropzoneProps> = (props) => {
  const { file, loading, onDrop, onClear, importOn } = props;
  let fileSize: number;
  if (file) {
    fileSize = file.size / 1024 / 1024;
    if (fileSize < 0.001) {
      fileSize = 0.001;
    }
  }

  const emptyFile = !file && importOn;

  return (
    <div className={cnDataImport('Dropzone')}>
      <Dropzone onDrop={onDrop} preventDropOnDocument={true} disabled={loading || Boolean(file)}>
        {({getRootProps, getInputProps, isDragActive}) => (
            <div
                className={cnDataImport('DropzoneControl', {fileOver: isDragActive})}
                {...getRootProps()}>
              <div className={cnDataImport('DropzoneCaption')}>
                Перетащите zip архив с shape файлами<br />или<br />
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
            <div className={cnDataImport('DropzoneFileName')}>
              {emptyFile ? 'Загруженный файл' : file.name}
            </div>
            { emptyFile ? null : (
              <div className={cnDataImport('DropzoneFileSize')}>
                { Number(fileSize.toFixed(3)) } MB
              </div>
            )}
            <IconButton className={cnDataImport('DropzoneFileDel')} onClick={onClear}>
              <DeleteIcon color='error' />
            </IconButton>
          </div>
        </div>
      ) : null}
      <Loading visible={loading} />
    </div>
  );
}
