import React, { type FC, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import type { Accept, FileRejection } from 'react-dropzone';

import { isZipFile } from '../../services/data/files/files.util';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { DataImportDropzone } from '../DataImportDropzone/DataImportDropzone';
import { Toast } from '../Toast/Toast';

import './ImportFileChooserDialog.scss';

const cnImportFileChooserDialog = cn('ImportFileChooserDialog');

const zipOnlyAccept: Accept = {
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  'application/octet-stream': ['.zip']
};

function warnZipShapeArchiveOnly(): void {
  Toast.warn('Поддерживается только ZIP-архив с shape-файлами');
}

function warnZipShapeImportRejected(_rejections: FileRejection[]): void {
  warnZipShapeArchiveOnly();
}

export interface ImportFileChooserDialogProps {
  open: boolean;
  onClose(): void;
  onFileChosen(file: File): void;
}

export const ImportFileChooserDialog: FC<ImportFileChooserDialogProps> = ({ open, onClose, onFileChosen }) => {
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (!open) {
      setFile(undefined);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setFile(undefined);
    onClose();
  }, [onClose]);

  const handleDrop = useCallback(
    (files: File[]) => {
      if (!files.length) {
        return;
      }

      const next = files[0];

      if (!isZipFile(next)) {
        warnZipShapeArchiveOnly();
        setFile(undefined);

        return;
      }

      setFile(next);
      onFileChosen(next);
    },
    [onFileChosen]
  );

  const handleClear = useCallback(() => {
    setFile(undefined);
  }, []);

  return (
    <Dialog
      className={cnImportFileChooserDialog()}
      slotProps={{ paper: { className: cnImportFileChooserDialog('Paper') } }}
      maxWidth='md'
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <DialogTitle className={cnImportFileChooserDialog('Title')}>Импорт данных</DialogTitle>

      <DialogContent className={cnImportFileChooserDialog('Content')}>
        <div className={cnImportFileChooserDialog('DropzoneWrap')}>
          <DataImportDropzone
            className={cnImportFileChooserDialog('Dropzone')}
            accept={zipOnlyAccept}
            captionLine='Перетащите ZIP-архив с shape-файлами'
            file={file}
            importOn={false}
            loading={false}
            onClear={handleClear}
            onDrop={handleDrop}
            onDropRejected={warnZipShapeImportRejected}
          />
        </div>
      </DialogContent>

      <DialogActions className={cnImportFileChooserDialog('Actions')}>
        <ActionsRight className={cnImportFileChooserDialog('ActionsRight')}>
          <Button onClick={handleClose}>Закрыть</Button>
        </ActionsRight>
      </DialogActions>
    </Dialog>
  );
};
