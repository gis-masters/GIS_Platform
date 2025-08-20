import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./Attributes-Resize.scss';
import '!style-loader!css-loader!sass-loader!../Resizing/Attributes-Resizing.scss';

type AttributesResizeProps = {
  onResize(arg: number): void;
  initialHeight: number;
};

const cnAttributesResize = cn('Attributes', 'Resize');
const cnAttributesResizing = cn('Attributes', 'Resizing');

export class AttributesResize extends Component<AttributesResizeProps> {
  private started: boolean = false;
  private initialY?: number;
  private finishY?: number;

  render() {
    return <div className={cnAttributesResize()} onPointerDown={this.onResizeStart} />;
  }

  @boundMethod
  private onResizeStart(e: React.MouseEvent) {
    this.started = true;
    this.initialY = e.pageY;
    this.finishY = this.props.initialHeight;

    document.body.classList.add(cnAttributesResizing());

    document.addEventListener('mousemove', this.handleDocumentMove);
    document.addEventListener('mouseup', this.handleResizeEnd);
    document.addEventListener('mouseleave', this.handleResizeLeave);
  }

  @boundMethod
  private handleDocumentMove(e: MouseEvent) {
    if (!this.started || !this.initialY || !this.finishY) {
      return;
    }
    const value = e.pageY - this.initialY;

    this.props.onResize(this.finishY - value);
  }

  @boundMethod
  private handleResizeEnd() {
    this.started = false;
    this.initialY = undefined;
    this.finishY = this.props.initialHeight;

    this.saveHeight(this.props.initialHeight);
    window.dispatchEvent(new Event('resize'));

    document.body.classList.remove(cnAttributesResizing());

    document.removeEventListener('mousemove', this.handleDocumentMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
    document.removeEventListener('mouseleave', this.handleResizeLeave);
  }

  private saveHeight(arg: number) {
    localStorage.setItem('atr-size', `${arg}`);
  }

  @boundMethod
  private handleResizeLeave() {
    document.removeEventListener('mousemove', this.handleDocumentMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
    document.removeEventListener('mouseleave', this.handleResizeLeave);
  }
}
