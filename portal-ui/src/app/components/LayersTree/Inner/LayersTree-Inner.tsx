import React, { FC, LegacyRef, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { DroppableProvidedProps } from 'react-beautiful-dnd';

import { currentProject } from '../../../stores/CurrentProject.store';
import { LayersTreeItem } from '../Item/LayersTree-Item';
import { LayersTreeItemContainer } from '../ItemContainer/LayersTree-ItemContainer';

const cnLayersTreeInner = cn('LayersTree', 'Inner');

interface LayersTreeInnerProps {
  innerRef: LegacyRef<HTMLDivElement> | undefined;
  droppableProvidedProps: DroppableProvidedProps;
  editMode: boolean;
  placeholder: ReactNode;
  highlightedGroupId?: number;
}

export const LayersTreeInner: FC<LayersTreeInnerProps> = observer(
  ({ droppableProvidedProps, innerRef, editMode, placeholder, highlightedGroupId }) => {
    let sidebarEditMode = editMode;
    let layers = editMode ? currentProject.visibleTreeWithEmptyGroups : currentProject.visibleTree;

    if (currentProject.filter) {
      sidebarEditMode = false;
      layers = currentProject.filteredTree;
    }

    return (
      <div className={cnLayersTreeInner()} ref={innerRef} {...droppableProvidedProps}>
        {layers?.map((item, i) => (
          <LayersTreeItemContainer
            editMode={sidebarEditMode}
            key={`${item.isGroup ? 'g' : 'l'}${item.id}`}
            index={i}
            id={`LayersTreeItem_${item.isGroup ? 'g' : 'l'}_${item.id}`}
          >
            <LayersTreeItem
              item={item}
              highlighted={item.isGroup && item.payload.id === highlightedGroupId}
              editMode={sidebarEditMode}
            />
          </LayersTreeItemContainer>
        ))}
        {placeholder}
      </div>
    );
  }
);
