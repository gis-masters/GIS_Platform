import React, { Component, MouseEvent } from 'react';
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
  private started: boolean;
  private initialY: number | undefined;
  private finishY: number;

  render() {
    return <div className={cnAttributesResize()} onPointerDown={this.onResizeStart} />;
  }

  @boundMethod
  private onResizeStart(e: MouseEvent) {
    this.started = true;
    this.initialY = e.pageY;
    this.finishY = this.props.initialHeight;

    document.body.classList.add(cnAttributesResizing());

    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
    document.addEventListener('mouseleave', this.onResizeLeave);
  }

  @boundMethod
  private onResizeMove(e: PointerEvent) {
    if (!this.started) {
      return;
    }
    const value = e.pageY - this.initialY;

    this.props.onResize(this.finishY - value);
  }

  @boundMethod
  private onResizeEnd() {
    this.started = false;
    this.initialY = undefined;
    this.finishY = this.props.initialHeight;

    this.saveHeight(this.props.initialHeight);
    window.dispatchEvent(new Event('resize'));

    document.body.classList.remove(cnAttributesResizing());

    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
    document.removeEventListener('mouseleave', this.onResizeLeave);
  }

  private saveHeight(arg: number) {
    localStorage.setItem('atr-size', `${arg}`);
  }

  @boundMethod
  private onResizeLeave() {
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
    document.removeEventListener('mouseleave', this.onResizeLeave);
  }
}
