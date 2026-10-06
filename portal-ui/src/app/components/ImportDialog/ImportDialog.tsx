import React, { type FC, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import type { Accept } from 'react-dropzone';

import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { DataImportDropzone } from '../DataImportDropzone/DataImportDropzone';

import './ImportDialog.scss';

const cnImportDialog = cn('ImportDialog');

const geoPackageAccept: Accept = {
  'application/geopackage+sqlite3': ['.gpkg'],
  'application/octet-stream': ['.gpkg']
};

export interface ImportDialogProps {
  open: boolean;
  onClose(): void;
  /** Файл, выбранный на предыдущем шаге (диалог выбора типа импорта) */
  initialFile?: File;
}

export const ImportDialog: FC<ImportDialogProps> = ({ open, onClose, initialFile }) => {
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (!open) {
      setFile(undefined);

      return;
    }

    if (initialFile) {
      setFile(initialFile);
    }
  }, [open, initialFile]);

  const handleClose = useCallback(() => {
    setFile(undefined);
    onClose();
  }, [onClose]);

  const handleDrop = useCallback((files: File[]) => {
    if (files.length) {
      setFile(files[0]);
    }
  }, []);

  const handleClear = useCallback(() => {
    setFile(undefined);
  }, []);

  return (
    <Dialog
      maxWidth='md'
      fullWidth
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: { className: cnImportDialog() }
      }}
    >
      <DialogTitle className={cnImportDialog('Title')}>
        <span>Импорт из GeoPackage</span>
      </DialogTitle>

      <DialogContent className={cnImportDialog('Content')}>
        <div className={cnImportDialog('DropzoneWrap')}>
          <DataImportDropzone
            accept={geoPackageAccept}
            captionLine='Перетащите файл GeoPackage (.gpkg)'
            file={file}
            importOn={false}
            loading={false}
            onClear={handleClear}
            onDrop={handleDrop}
          />
        </div>
      </DialogContent>

      <DialogActions className={cnImportDialog('Actions')}>
        <ActionsRight className={cnImportDialog('ActionsRight')}>
          <Button onClick={handleClose}>Закрыть</Button>
        </ActionsRight>
      </DialogActions>
    </Dialog>
  );
};
