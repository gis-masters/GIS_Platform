import React, { FC, ReactNode } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { cn } from '@bem-react/classname';
import { Paper } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./LayersTree-ItemContainer.scss';

declare module 'react-beautiful-dnd' {
  export interface DraggingStyle {
    [key: string]: string | number;
  }
  export interface NotDraggingStyle {
    [key: string]: string | number;
  }
}

const cnLayersTreeItemContainer = cn('LayersTree', 'ItemContainer');

interface LayersTreeItemContainerProps {
  editMode: boolean;
  index: number;
  id: string;
  children: ReactNode;
}

export const LayersTreeItemContainer: FC<LayersTreeItemContainerProps> = ({ editMode, children, index, id }) => (
  <Draggable draggableId={id} index={index} isDragDisabled={!editMode}>
    {provided => (
      <Paper
        className={cnLayersTreeItemContainer({ editMode })}
        square
        elevation={editMode ? 1 : 0}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {children}
      </Paper>
    )}
  </Draggable>
);
