import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCellBorder.scss';
import '!style-loader!css-loader!sass-loader!../ColResizing/XTable-ColResizing.scss';

const cnXTableHeadCellBorder = cn('XTable', 'HeadCellBorder');
const cnXTableColResizing = cn('XTable', 'ColResizing');

interface XTableHeadCellBorderProps {
  onResizeStart(): void;
  onResize(deltaX: number): void;
}

@observer
export class XTableHeadCellBorder extends Component<XTableHeadCellBorderProps> {
  @observable private dragging = false;
  private startX?: number;
  private lastX?: number;

  constructor(props: XTableHeadCellBorderProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <span className={cnXTableHeadCellBorder({ dragging: this.dragging })} onMouseDownCapture={this.handleDragStart} />
    );
  }

  @boundMethod
  private handleDragStart(e: React.MouseEvent<HTMLSpanElement>) {
    this.lastX = e.clientX;
    this.startX = e.clientX;
    this.props.onResizeStart();
    this.setDragging(true);
    document.body.addEventListener('mousemove', this.handleDrag);
    document.body.addEventListener('mouseup', this.handleDragEnd);
    document.body.classList.add(cnXTableColResizing());
  }

  @boundMethod
  private handleDrag(e: MouseEvent) {
    if (this.dragging && e.clientX > 0) {
      this.lastX = e.clientX;
      this.props.onResize(this.lastX - (this.startX || 0));
    }
  }

  @boundMethod
  private handleDragEnd() {
    this.setDragging(false);
    document.body.removeEventListener('mousemove', this.handleDrag);
    document.body.removeEventListener('mouseup', this.handleDragEnd);
    document.body.classList.remove(cnXTableColResizing());
  }

  @action
  private setDragging(dragging: boolean) {
    this.dragging = dragging;
  }
}
