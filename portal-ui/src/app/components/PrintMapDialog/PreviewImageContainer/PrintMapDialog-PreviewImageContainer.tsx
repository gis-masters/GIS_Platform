import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';
import { printSettings } from '../../../stores/PrintSettings.store';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-PreviewImageContainer.scss';

const cnPrintMapDialogPreviewImageContainer = cn('PrintMapDialog', 'PreviewImageContainer');

interface PrintMapDialogPreviewImageContainerProps extends ChildrenProps {
  onDragStart(e: React.DragEvent<HTMLDivElement>): void;
  onDragEnd(e: React.DragEvent<HTMLDivElement>): void;
  onDrag(e: React.DragEvent<HTMLDivElement>): void;
}

export const PrintMapDialogPreviewImageContainer: FC<PrintMapDialogPreviewImageContainerProps> = observer(
  ({ onDragStart, onDragEnd, onDrag, children }) => (
    <div
      className={cnPrintMapDialogPreviewImageContainer({ border: printSettings.border })}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      draggable
    >
      {children}
    </div>
  )
);
