import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DragDropContext, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../stores/CurrentProject.store';
import { projectsService } from '../../services/crg/projects.service';
import { TreeItem } from '../../services/crg/projects.models';

import { LayersTreeInner } from './Inner/LayersTree-Inner';

const cnLayersTree = cn('LayersTree');

interface LayersTreeProps {
  editMode: boolean;
}

@observer
export class LayersTree extends Component<LayersTreeProps> {
  @observable combineEnabled = false;
  @observable highlightedGroupId?: number;

  componentDidMount() {
    projectsService.testCurrentProjectLayers();
  }

  render() {
    const { editMode } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>
        <div className={cnLayersTree()} data-subscribe={this.highlightedGroupId}>
          <Droppable droppableId='LayersTree' isDropDisabled={!editMode} isCombineEnabled={this.combineEnabled}>
            {provided => (
              <LayersTreeInner
                droppableProvidedProps={provided.droppableProps}
                editMode={editMode}
                innerRef={provided.innerRef}
                placeholder={provided.placeholder}
                highlightedGroupId={this.highlightedGroupId}
              />
            )}
          </Droppable>
        </div>
      </DragDropContext>
    );
  }

  @boundMethod
  private onDragUpdate({ source, destination, combine }: DragUpdate) {
    if ((!combine && !destination) || source.index === destination?.index) {
      this.setCombine(false, null);
    } else {
      const sourceItem = currentProject.visibleTreeWithEmptyGroups[source.index];
      const destinationItem = combine
        ? this.getItemByDraggableId(combine.draggableId)
        : currentProject.visibleTreeWithEmptyGroups[destination.index];

      this.setCombine(
        destinationItem.isGroup && !currentProject.isAncestor(destinationItem, sourceItem),
        destinationItem.isGroup && combine ? destinationItem : null
      );
    }
  }

  @action.bound
  private onDragEnd({ source, destination, combine }: DropResult) {
    this.setCombine(false, null);
    const sourceItem = currentProject.visibleTreeWithEmptyGroups[source.index];

    if (combine) {
      const parent = this.getItemByDraggableId(combine.draggableId);
      sourceItem.payload[sourceItem.isGroup ? 'parent' : 'groupId'] = parent.payload.id;
      sourceItem.payload.position = -42;
      this.reorder();
    }

    if (!destination || source.index === destination.index) {
      return;
    }

    const forward = source.index < destination.index;
    const destinationItem = currentProject.visibleTreeWithEmptyGroups[destination.index];

    if (currentProject.isAncestor(destinationItem, sourceItem)) {
      return;
    }

    const beforeItem = forward
      ? destinationItem
      : currentProject.visibleTreeWithEmptyGroups.slice()[destination.index - 1];
    const afterItem = !forward
      ? destinationItem
      : currentProject.visibleTreeWithEmptyGroups.slice()[destination.index + 1];
    const newTree = [...currentProject.tree];
    const oldIndex = this.getItemIndex(sourceItem);

    newTree.splice(oldIndex, 1);

    let newIndex: number;
    if (forward) {
      newIndex = beforeItem ? this.getItemIndex(beforeItem) : 0;
    } else {
      newIndex = afterItem ? this.getItemIndex(afterItem) : currentProject.tree.length;
    }

    newTree.splice(newIndex, 0, sourceItem);

    this.reorder(newTree);

    const parent =
      beforeItem && afterItem
        ? currentProject.getClosestCommonAncestor(beforeItem, afterItem)
        : (beforeItem || afterItem).parent;

    sourceItem.payload[sourceItem.isGroup ? 'parent' : 'groupId'] = parent?.payload?.id;
  }

  @action
  private reorder(tree?: TreeItem[]) {
    (tree || currentProject.tree).forEach(({ payload }, i) => {
      payload.position = i + 1;
    });
  }

  @action
  private setCombine(enabled: boolean, to?: TreeItem) {
    this.combineEnabled = enabled;
    this.highlightedGroupId = to?.payload?.id;
  }

  private getItemByDraggableId(draggableId: string): TreeItem {
    const [, g, id] = draggableId.split('_');

    return currentProject.tree.find(({ payload, isGroup }) => payload.id === Number(id) && isGroup === (g === 'g'));
  }

  private getItemIndex(item: TreeItem): number {
    return currentProject.tree.findIndex(({ id, isGroup }) => id === item.id && isGroup === item.isGroup);
  }
}
