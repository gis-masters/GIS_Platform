import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type Dataset } from '../../services/data/vectorData/vectorData.models';
import { getDatasets } from '../../services/data/vectorData/vectorData.service';
import { checkIsUpdateAllowed } from '../../services/permissions/permissions.service';
import { Button } from '../Button/Button';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { type XTableColumn } from '../XTable/XTable.models';

import './GpkgVectorTablePlacementDialog.scss';

const cnGpkgVectorTablePlacementDialog = cn('GpkgVectorTablePlacementDialog');

const datasetPickerCols: XTableColumn<Dataset>[] = [
  {
    field: 'title',
    title: 'Название',
    filterable: true,
    sortable: true
  },
  {
    field: 'identifier',
    title: 'Идентификатор',
    filterable: true,
    sortable: true
  },
  {
    field: 'details',
    title: 'Описание',
    filterable: true,
    sortable: true
  }
];

function getDatasetRowId(dataset: Dataset): string {
  return dataset.identifier;
}

function datasetWriteDisabledTester(dataset: Dataset): boolean | string {
  return checkIsUpdateAllowed(dataset.role) ? false : 'Недостаточно прав для редактирования набора';
}

export interface GpkgVectorTablePlacementDialogProps {
  open: boolean;
  tableName?: string;
  autoDatasetExists?: boolean;
  onClose(): void;
  onPlace(dataset?: Dataset): void;
}

type GpkgVectorTablePlacementDialogState = {
  datasetPickerOpen: boolean;
  setDatasetPickerOpen(value: boolean): void;
};

export const GpkgVectorTablePlacementDialog: FC<GpkgVectorTablePlacementDialogProps> = observer(
  ({ open, tableName, autoDatasetExists = false, onClose, onPlace }) => {
    const state = useLocalObservable<GpkgVectorTablePlacementDialogState>(() => ({
      datasetPickerOpen: false,
      setDatasetPickerOpen(value) {
        this.datasetPickerOpen = value;
      }
    }));

    const handleClose = useCallback(() => {
      state.setDatasetPickerOpen(false);
      onClose();
    }, [onClose, state]);

    const handleAutoDataset = useCallback(() => {
      handleClose();
      onPlace();
    }, [handleClose, onPlace]);

    const handleChooseExisting = useCallback(() => {
      state.setDatasetPickerOpen(true);
    }, [state]);

    const handleDatasetPickerClose = useCallback(() => {
      state.setDatasetPickerOpen(false);
    }, [state]);

    const handleDatasetSelect = useCallback(
      (datasets: Dataset[]) => {
        const [dataset] = datasets;
        if (!dataset) {
          return;
        }

        handleClose();
        onPlace(dataset);
      },
      [handleClose, onPlace]
    );

    const subject = tableName ? `Таблицу "${tableName}"` : 'Выбранные слои';
    const explanation = autoDatasetExists
      ? `Для этого GeoPackage автоматический набор данных уже создавался. ${subject} можно поместить в него или выбрать другой существующий.`
      : `${subject} можно поместить в новый набор данных, который сейчас создастся автоматически, либо выбрать существующий.`;

    return (
      <>
        <Dialog
          maxWidth='sm'
          fullWidth
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: { className: cnGpkgVectorTablePlacementDialog() }
          }}
        >
          <DialogTitle>{tableName ? 'Размещение векторной таблицы' : 'Размещение слоёв'}</DialogTitle>
          <DialogContent className={cnGpkgVectorTablePlacementDialog('Content')}>
            <DialogContentText>{explanation}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={handleAutoDataset}>
              {autoDatasetExists ? 'Использовать созданный' : 'Создать новый'}
            </Button>
            <Button color='secondary' onClick={handleChooseExisting}>
              Выбрать существующий
            </Button>
            <Button onClick={handleClose}>Отмена</Button>
          </DialogActions>
        </Dialog>

        <ChooseXTableDialog<Dataset>
          title='Выбор набора данных'
          getData={getDatasets}
          cols={datasetPickerCols}
          getRowId={getDatasetRowId}
          disabledTester={datasetWriteDisabledTester}
          open={open && state.datasetPickerOpen}
          onClose={handleDatasetPickerClose}
          onSelect={handleDatasetSelect}
          maxWidth='md'
          fullWidth
          single
        />
      </>
    );
  }
);
