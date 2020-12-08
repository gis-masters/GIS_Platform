import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { cn } from '@bem-react/classname';
import { Paper } from '@material-ui/core';

import '!style-loader!css-loader!sass-loader!./LayersTree-ItemContainer.scss';

const cnLayersTreeItemContainer = cn('LayersTree', 'ItemContainer');

interface LayersTreeItemContainerProps {
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
