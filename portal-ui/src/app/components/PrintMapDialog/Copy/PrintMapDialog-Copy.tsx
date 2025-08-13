import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { getMapImage, ImageMime, prepareMapCopying } from '../../../services/map/map-print.service';
import { copyNodeToClipboard } from '../../../services/util/clipboard.util';
import { Toast } from '../../Toast/Toast';
import { PrintMapDialogCopyButton } from '../CopyButton/PrintMapDialog-CopyButton';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Copy.scss';

const cnPrintMapDialogCopy = cn('PrintMapDialog', 'Copy');

@observer
export class PrintMapDialogCopy extends Component {
  @observable private ready = false;
  @observable private hover = false;
  private node?: HTMLDivElement;
  private operationId?: symbol;
  private readonly clipboardApiAvailable: boolean;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
    this.clipboardApiAvailable = Boolean(navigator.clipboard?.write);
  }

  render() {
    const disabled = !this.clipboardApiAvailable && !this.ready;

    return (
      <Tooltip title={disabled ? 'Подождите...' : 'Скопировать изображение в буфер обмена'}>
        <div
          className={cnPrintMapDialogCopy()}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <PrintMapDialogCopyButton
            onClick={this.handleClick}
            disabled={disabled}
            color={this.clipboardApiAvailable ? 'default' : 'primary'}
          />
        </div>
      </Tooltip>
    );
  }

  @boundMethod
  private async handleMouseEnter() {
    if (this.clipboardApiAvailable) {
      return;
    }
    this.setHover(true);
    const operationId = Symbol();
    this.operationId = operationId;
    const img = await prepareMapCopying();
    if (this.hover && this.operationId === operationId) {
      this.setReady(true);
      this.node = img;
    } else {
      img.remove();
    }
  }

  @boundMethod
  private handleMouseLeave() {
    if (this.clipboardApiAvailable) {
      return;
    }
    this.setHover(false);
    if (this.node) {
      this.node.remove();
      delete this.node;
    }
    this.setReady(false);
  }

  @boundMethod
  private async handleClick() {
    if (this.clipboardApiAvailable) {
      const src = await getMapImage({ mime: ImageMime.PNG, hideScaleDigits: true });
      const request = await fetch(src);
      const blob = await request.blob();
      const clipboardItemInput = new ClipboardItem({ [ImageMime.PNG]: blob });
      await navigator.clipboard.write([clipboardItemInput]);
    } else if (this.node) {
      copyNodeToClipboard(this.node);
    }

    Toast.success('Скопировано в буфер обмена');
  }

  @action
  private setHover(hover: boolean) {
    this.hover = hover;
  }

  @action
  private setReady(ready: boolean) {
    this.ready = ready;
  }
}
