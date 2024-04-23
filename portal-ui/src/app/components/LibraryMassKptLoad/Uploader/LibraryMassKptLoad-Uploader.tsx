import React, { FC } from 'react';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!../Content/LibraryMassKptLoad-Content.scss';

interface LibraryMassKptLoadProps {
  isOpen: boolean;
  count: number;
  handledCount: number;
  successCount: number;
  failedCount: number;
  progress: number;
  onStopLoading(): void;
}

const cnLibraryMassKptLoad = cn('LibraryMassKptLoad');

export const LibraryMassKptLoadUploader: FC<LibraryMassKptLoadProps> = ({
  isOpen,
  count,
  handledCount,
  successCount,
  failedCount,
  progress,
  onStopLoading
}) => (
  <Dialog open={isOpen} className={cnLibraryMassKptLoad('Uploader')}>
    <DialogTitle>Массовая загрузка КПТ</DialogTitle>
    <DialogContent className={cnLibraryMassKptLoad('Content')}>
      <Typography paragraph>
        Загружено/размещено {handledCount} из {count}
      </Typography>
      <Typography>Успешно загружено {successCount}</Typography>
      {!!failedCount && <Typography>Загружено с ошибкой {failedCount}</Typography>}
      <CircularProgress value={progress} size={100} variant='determinate' />
    </DialogContent>
    <DialogActions>
      <Button onClick={onStopLoading}>Остановить</Button>
    </DialogActions>
  </Dialog>
);
