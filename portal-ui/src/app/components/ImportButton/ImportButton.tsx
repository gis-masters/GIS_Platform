import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { PublishOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { services } from '../../services/services';
import { currentImport } from '../../stores/CurrentImport.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { GpkgPlacementDialog } from '../GpkgPlacementDialog/GpkgPlacementDialog';
import { IconButton } from '../IconButton/IconButton';
import { ImportFileChooserDialog } from '../ImportFileChooserDialog/ImportFileChooserDialog';

const cnImportButton = cn('ImportButton');

type ImportButtonState = {
  chooserOpen: boolean;
  gpkgPlacementDialogOpen: boolean;
  gpkgFile: File | undefined;
  setChooserOpen(value: boolean): void;
  openGpkgPlacement(file: File): void;
  closeGpkgPlacement(): void;
};

export const ImportButton: FC = observer(() => {
  const state = useLocalObservable<ImportButtonState>(() => ({
    chooserOpen: false,
    gpkgPlacementDialogOpen: false,
    gpkgFile: undefined,
    setChooserOpen(value) {
      this.chooserOpen = value;
    },
    openGpkgPlacement(file) {
      this.chooserOpen = false;
      this.gpkgFile = file;
      this.gpkgPlacementDialogOpen = true;
    },
    closeGpkgPlacement() {
      this.gpkgPlacementDialogOpen = false;
      this.gpkgFile = undefined;
    }
  }));

  const handleOpenChooser = useCallback(() => {
    state.setChooserOpen(true);
  }, [state]);

  const handleCloseChooser = useCallback(() => {
    state.setChooserOpen(false);
  }, [state]);

  const handleFileChosen = useCallback(
    (file: File) => {
      state.setChooserOpen(false);

      currentImport.reset({ file });

      void services.ngZone.run(async () => {
        await services.router.navigate([`/projects/${currentProject.id}/import`]);
      });
    },
    [state]
  );

  const handleGeoPackageFileChosen = useCallback(
    (file: File) => {
      state.openGpkgPlacement(file);
    },
    [state]
  );

  const handleCloseGpkgPlacement = useCallback(() => {
    state.closeGpkgPlacement();
  }, [state]);

  return (
    <>
      <Tooltip title='Импорт данных'>
        <IconButton className={cnImportButton()} color='inherit' onClick={handleOpenChooser}>
          <PublishOutlined />
        </IconButton>
      </Tooltip>

      <ImportFileChooserDialog
        open={state.chooserOpen}
        onClose={handleCloseChooser}
        onFileChosen={handleFileChosen}
        onGeoPackageFileChosen={handleGeoPackageFileChosen}
      />

      <GpkgPlacementDialog
        open={state.gpkgPlacementDialogOpen}
        file={state.gpkgFile}
        onClose={handleCloseGpkgPlacement}
      />
    </>
  );
});
