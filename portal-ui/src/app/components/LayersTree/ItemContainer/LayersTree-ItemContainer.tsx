import React, { FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { Draggable } from 'react-beautiful-dnd';

import { ChildrenProps } from '../../../services/models';

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

interface LayersTreeItemContainerProps extends ChildrenProps {
  editMode: boolean;
  index: number;
  id: string;
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
