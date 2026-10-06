import React, { type FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import type { Accept, FileRejection } from 'react-dropzone';

import { isGpkgFile, isZipFile } from '../../services/data/files/files.util';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { DataImportDropzone } from '../DataImportDropzone/DataImportDropzone';
import { Toast } from '../Toast/Toast';

import './ImportFileChooserDialog.scss';

const cnImportFileChooserDialog = cn('ImportFileChooserDialog');

const importChooserAccept: Accept = {
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
  'application/geopackage+sqlite3': ['.gpkg'],
  'application/octet-stream': ['.zip', '.gpkg']
};

function warnUnsupportedImportChooserFile(): void {
  Toast.warn('Поддерживаются ZIP-архив с shape-файлами или файл GeoPackage (.gpkg)');
}

function warnImportChooserRejected(_rejections: FileRejection[]): void {
  warnUnsupportedImportChooserFile();
}

export interface ImportFileChooserDialogProps {
  open: boolean;
  onClose(): void;
  /** ZIP со shape — текущий поток scratch-import */
  onFileChosen(file: File): void;
  /** GeoPackage — родитель закрывает этот диалог и открывает отдельный поток GPKG */
  onGeoPackageFileChosen(file: File): void;
}

type ImportFileChooserDialogState = {
  file: File | undefined;
  setFile(value: File | undefined): void;
};

export const ImportFileChooserDialog: FC<ImportFileChooserDialogProps> = observer(
  ({ open, onClose, onFileChosen, onGeoPackageFileChosen }) => {
    const state = useLocalObservable<ImportFileChooserDialogState>(() => ({
      file: undefined,
      setFile(value) {
        this.file = value;
      }
    }));

    useEffect(() => {
      if (!open) {
        state.setFile(undefined);
      }
    }, [open, state]);

    const handleClose = useCallback(() => {
      state.setFile(undefined);
      onClose();
    }, [onClose, state]);

    const handleDrop = useCallback(
      (files: File[]) => {
        if (!files.length) {
          return;
        }

        const next = files[0];

        if (isZipFile(next)) {
          state.setFile(next);
          onFileChosen(next);

          return;
        }

        if (isGpkgFile(next)) {
          state.setFile(undefined);
          onGeoPackageFileChosen(next);

          return;
        }

        warnUnsupportedImportChooserFile();
        state.setFile(undefined);
      },
      [onFileChosen, onGeoPackageFileChosen, state]
    );

    const handleClear = useCallback(() => {
      state.setFile(undefined);
    }, [state]);

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
              accept={importChooserAccept}
              captionLine='Перетащите ZIP-архив с shape-файлами или файл GeoPackage (.gpkg)'
              file={state.file}
              importOn={false}
              loading={false}
              onClear={handleClear}
              onDrop={handleDrop}
              onDropRejected={warnImportChooserRejected}
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
  }
);
