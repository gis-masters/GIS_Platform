import React, { FC, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { DroppableProvidedProps } from 'react-beautiful-dnd';

import { currentProject } from '../../../stores/CurrentProject.store';
import { LayersTreeItem } from '../Item/LayersTree-Item';
import { LayersTreeItemContainer } from '../ItemContainer/LayersTree-ItemContainer';

const cnLayersTreeInner = cn('LayersTree', 'Inner');

interface LayersTreeInnerProps {
  innerRef: (element: HTMLElement) => unknown;
  droppableProvidedProps: DroppableProvidedProps;
  editMode: boolean;
  placeholder: ReactNode;
  highlightedGroupId: number;
}

export const LayersTreeInner: FC<LayersTreeInnerProps> = observer(
  ({ droppableProvidedProps, innerRef, editMode, placeholder, highlightedGroupId }) => (
    <div className={cnLayersTreeInner()} ref={innerRef} {...droppableProvidedProps}>
      {(editMode ? currentProject.visibleTreeWithEmptyGroups : currentProject.visibleTree).map((item, i) => (
        <LayersTreeItemContainer
          editMode={editMode}
          key={`${item.isGroup ? 'g' : 'l'}${item.id}`}
          index={i}
          id={`LayersTreeItem_${item.isGroup ? 'g' : 'l'}_${item.id}`}
        >
          <LayersTreeItem
            item={item}
            highlighted={item.isGroup && item.payload.id === highlightedGroupId}
            editMode={editMode}
          />
        </LayersTreeItemContainer>
      ))}
      {placeholder}
    </div>
  )
);
