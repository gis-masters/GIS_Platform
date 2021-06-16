import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { printSettings } from '../../../stores/PrintSettings.store';

import '!style-loader!css-loader!sass-loader!./PrintDialog-PreviewImageContainer.scss';

const cnPrintDialogPreviewImageContainer = cn('PrintDialog', 'PreviewImageContainer');

interface PrintDialogPreviewImageContainerProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const PrintDialogPreviewImageContainer: FC<PrintDialogPreviewImageContainerProps> = observer(
  ({ onDragStart, onDragEnd, onDrag, children }) => (
    <div
      className={cnPrintDialogPreviewImageContainer({ border: printSettings.border })}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      draggable
    >
      {children}
    </div>
  )
);
