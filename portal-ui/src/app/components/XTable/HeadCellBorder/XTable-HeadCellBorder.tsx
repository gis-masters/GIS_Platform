import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCellBorder.scss';

const cnXTableHeadCellBorder = cn('XTable', 'HeadCellBorder');

interface XTableHeadCellBorderProps {
  onResizeStart(): void;
  onResize(deltaX: number): void;
}

@observer
export class XTableHeadCellBorder extends Component<XTableHeadCellBorderProps> {
  @observable private dragging = false;
  private startX: number;
  private lastX: number;

  constructor(props: XTableHeadCellBorderProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <span
        className={cnXTableHeadCellBorder({ dragging: this.dragging })}
        onDrag={this.dragHandler}
        onDragStart={this.dragStartHandler}
        onDragEnd={this.dragEndHandler}
        draggable
      />
    );
  }

  @boundMethod
  private dragStartHandler(e: React.DragEvent<HTMLSpanElement>) {
    e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
    this.lastX = e.clientX;
    this.startX = e.clientX;
    this.props.onResizeStart();
    this.setDragging(true);
  }

  @boundMethod
  private dragHandler(e: React.DragEvent<HTMLSpanElement>) {
    if (e.clientX > 0) {
      this.lastX = e.clientX;
      this.props.onResize(this.lastX - this.startX);
    }
  }

  @boundMethod
  private dragEndHandler(e: React.DragEvent<HTMLSpanElement>) {
    e.preventDefault();
    this.setDragging(false);
  }

  @action
  private setDragging(dragging: boolean) {
    this.dragging = dragging;
  }
}
