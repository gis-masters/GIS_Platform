import React, { type FC, useCallback, useRef } from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Popover, Typography } from '@mui/material';
import { GetApp, InfoOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { exportLayersAsGeoPackage, getExportDownloadUrl } from '../../services/data/export/export.service';
import { ProcessStatus } from '../../services/data/processes/processes.models';
import { getProcess } from '../../services/data/processes/processes.service';
import { type CrgLayer } from '../../services/gis/layers/layers.models';
import { downloadByUrl } from '../../services/util/FileSaver';
import { isArray } from '../../services/util/typeGuards/isArray';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { currentProject } from '../../stores/CurrentProject.store';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { LayersList } from '../LayersList/LayersList';

import './ExportGeoPackageDialog.scss';

const cnExportGeoPackageDialog = cn('ExportGeoPackageDialog');

export interface ExportGeoPackageDialogProps {
  open: boolean;
  onClose(): void;
}

type ExportGeoPackageDialogState = {
  selectedLayers: CrgLayer[];
  isExporting: boolean;
  exportCompleted: boolean;
  lastMessage: string;
  previousMessage: string;
  messageKey: number;
  allMessages: string[];
  historyOpen: boolean;
  filePath: string;
  setSelectedLayers(layers: CrgLayer[]): void;
  setIsExporting(exporting: boolean): void;
  setExportCompleted(completed: boolean): void;
  setLastMessage(message: string): void;
  setHistoryOpen(open: boolean): void;
  setFilePath(path: string): void;
  reset(): void;
};

export const ExportGeoPackageDialog: FC<ExportGeoPackageDialogProps> = observer(({ open, onClose }) => {
  const state = useLocalObservable<ExportGeoPackageDialogState>(() => ({
    selectedLayers: [],
    isExporting: false,
    exportCompleted: false,
    lastMessage: '',
    previousMessage: '',
    messageKey: 0,
    allMessages: [],
    historyOpen: false,
    filePath: '',

    setSelectedLayers(layers) {
      this.selectedLayers = layers;
    },

    setIsExporting(exporting) {
      this.isExporting = exporting;
    },

    setExportCompleted(completed) {
      this.exportCompleted = completed;
    },

    setLastMessage(message) {
      if (this.lastMessage !== message) {
        this.previousMessage = this.lastMessage;
        this.messageKey += 1;
        this.lastMessage = message;

        // Добавляем сообщение в историю
        if (message && !this.allMessages.includes(message)) {
          this.allMessages.push(message);
        }

        // Очищаем предыдущее сообщение через время анимации
        setTimeout(() => {
          runInAction(() => {
            this.previousMessage = '';
          });
        }, 500);
      }
    },

    setHistoryOpen(open) {
      this.historyOpen = open;
    },

    setFilePath(path) {
      this.filePath = path;
    },

    reset() {
      this.selectedLayers = [];
      this.isExporting = false;
      this.exportCompleted = false;
      this.lastMessage = '';
      this.previousMessage = '';
      this.messageKey = 0;
      this.allMessages = [];
      this.historyOpen = false;
      this.filePath = '';
    }
  }));

  const historyAnchorRef = useRef<HTMLButtonElement>(null);

  const handleHistoryOpen = useCallback(() => {
    state.setHistoryOpen(true);
  }, [state]);

  const handleHistoryClose = useCallback(() => {
    state.setHistoryOpen(false);
  }, [state]);

  const handleDownload = useCallback(() => {
    if (!state.filePath) {
      return;
    }

    const fileName = state.filePath.split(/[#?]/)[0].split(/[/\\]/).filter(Boolean).pop() || 'export.gpkg';
    downloadByUrl(getExportDownloadUrl(fileName), fileName);
  }, [state.filePath]);

  const onSelectLayers = useCallback(
    (layers: CrgLayer[]) => {
      state.setSelectedLayers(layers);
    },
    [state]
  );

  const closeDialog = useCallback(() => {
    state.reset();
    onClose();
  }, [onClose, state]);

  const extractMessageFromValue = useCallback((value: unknown): string | null => {
    if (typeof value === 'string') {
      return value;
    }

    if (isRecordStringUnknown(value) && typeof value.message === 'string') {
      return value.message;
    }

    return null;
  }, []);

  const extractLastMessage = useCallback(
    (details: unknown): string | null => {
      if (!details) {
        return null;
      }

      if (isArray(details) && details.length > 0) {
        const lastMsg = details.at(-1);

        return extractMessageFromValue(lastMsg);
      }

      if (isRecordStringUnknown(details) && isArray(details.messages) && details.messages.length > 0) {
        const lastMsg = details.messages.at(-1);

        return extractMessageFromValue(lastMsg);
      }

      return null;
    },
    [extractMessageFromValue]
  );

  const pollProcess = useCallback(
    (processId: number) => {
      const poll = async () => {
        try {
          const process = await getProcess(processId);

          const message = extractLastMessage(process.details);
          if (message) {
            state.setLastMessage(message);
          }

          const isFinished =
            process.status === ProcessStatus.DONE ||
            process.status === ProcessStatus.DONE_WITH_WARNINGS ||
            process.status === ProcessStatus.ERROR;

          if (isFinished) {
            state.setIsExporting(false);
            state.setExportCompleted(true);

            // Извлекаем путь к файлу из details.filePath
            if (isRecordStringUnknown(process.details) && typeof process.details.filePath === 'string') {
              state.setFilePath(process.details.filePath);
            }

            return;
          }

          setTimeout(poll, 300);
        } catch {
          state.setIsExporting(false);
        }
      };

      void poll();
    },
    [extractLastMessage, state]
  );

  const executeExport = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const layerIds = state.selectedLayers.map((layer: CrgLayer) => layer.id);

      state.setIsExporting(true);
      state.setLastMessage('Начало экспорта...');

      const process = await exportLayersAsGeoPackage(layerIds);

      void pollProcess(process.id);
    },
    [pollProcess, state]
  );

  const exportNotAllowed = !state.selectedLayers.length;

  return (
    <Dialog
      className={cnExportGeoPackageDialog()}
      PaperProps={{ className: cnExportGeoPackageDialog('Paper') }}
      maxWidth={'md'}
      fullWidth
      open={open}
    >
      <DialogTitle className={cnExportGeoPackageDialog('Title')}>
        <span>Экспорт в GeoPackage</span>
        <div className={cnExportGeoPackageDialog('Total')}>Всего выбрано: {state.selectedLayers.length}</div>
      </DialogTitle>

      <DialogContent className={cnExportGeoPackageDialog('Content')}>
        <form id='exportGmlSimpleForm' className={cnExportGeoPackageDialog('Form')} onSubmit={executeExport}>
          <LayersList
            layers={[...currentProject.vectorLayers, ...currentProject.rasterLayers]}
            onSelect={onSelectLayers}
          />
        </form>
      </DialogContent>

      <DialogActions className={cnExportGeoPackageDialog('Actions')}>
        {(state.lastMessage || state.previousMessage) && (
          <div className={cnExportGeoPackageDialog('StatusMessageWrapper')}>
            {state.previousMessage && (
              <div
                key={`prev-${state.messageKey - 1}`}
                className={cnExportGeoPackageDialog('StatusMessage', { leaving: true })}
              >
                {state.previousMessage}
              </div>
            )}
            {state.lastMessage && (
              <div
                key={`current-${state.messageKey}`}
                className={cnExportGeoPackageDialog('StatusMessage', { entering: true })}
              >
                {state.lastMessage}
              </div>
            )}
            {state.allMessages.length > 1 && (
              <>
                <IconButton
                  ref={historyAnchorRef}
                  size='small'
                  onClick={handleHistoryOpen}
                  className={cnExportGeoPackageDialog('HistoryButton')}
                >
                  <InfoOutlined fontSize='small' />
                </IconButton>
                <Popover
                  open={state.historyOpen}
                  anchorEl={historyAnchorRef.current}
                  onClose={handleHistoryClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                >
                  <div className={cnExportGeoPackageDialog('HistoryList')}>
                    <Typography variant='subtitle2' className={cnExportGeoPackageDialog('HistoryTitle')}>
                      История экспорта
                    </Typography>
                    {state.allMessages.map((message: string, index: number) => (
                      <Typography key={index} variant='body2' className={cnExportGeoPackageDialog('HistoryItem')}>
                        {message}
                      </Typography>
                    ))}
                  </div>
                </Popover>
              </>
            )}
          </div>
        )}
        <ActionsRight className={cnExportGeoPackageDialog('ActionsRight')}>
          {state.exportCompleted && state.filePath ? (
            <Button onClick={handleDownload} color='primary' startIcon={<GetApp />}>
              Скачать
            </Button>
          ) : (
            <Button
              type='submit'
              form='exportGmlSimpleForm'
              color='primary'
              disabled={exportNotAllowed || state.isExporting}
              loading={state.isExporting}
            >
              Экспорт
            </Button>
          )}
          <Button onClick={closeDialog} disabled={state.isExporting}>
            {state.exportCompleted ? 'Закрыть' : 'Отмена'}
          </Button>
        </ActionsRight>
      </DialogActions>
    </Dialog>
  );
});
