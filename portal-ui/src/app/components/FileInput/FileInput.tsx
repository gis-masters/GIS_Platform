import React, { Component, createRef, DetailedHTMLProps, InputHTMLAttributes, ReactNode, RefObject } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline, Close } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';

import { Button, ButtonProps } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./FileInput.scss';

const cnFileInput = cn('FileInput');

interface FileInputProps
  extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  onChange?: (selectedFiles: FileList | null) => void;
  fullWidth?: boolean;
  buttonCaption?: ReactNode;
  nameHidden?: boolean;
  iconButton?: boolean;
  buttonProps?: Omit<ButtonProps, 'ref'>;
  autoClear?: boolean;
}

@observer
export class FileInput extends Component<FileInputProps> {
  private inputRef: RefObject<HTMLInputElement> = createRef();
  private btnRef: RefObject<HTMLButtonElement> = createRef();
  @observable private _empty = true;
  @observable private files: FileList | null = null;

  render() {
    const {
      className,
      onChange,
      fullWidth,
      value,
      buttonCaption = 'Выбрать',
      nameHidden,
      iconButton,
      buttonProps,
      autoClear,
      ...otherProps
    } = this.props;

    return (
      <span
        className={cnFileInput({ fullWidth, empty: this.empty, btnMode: iconButton ? 'icon' : 'button' }, [className])}
      >
        {!nameHidden && <span className={cnFileInput('Filename')}>{this.caption}</span>}

        <input
          type='file'
          className={cnFileInput('Input')}
          ref={this.inputRef}
          {...otherProps}
          onChange={this.handleChange}
          tabIndex={-1}
        />

        {!this.empty && !nameHidden && !autoClear && (
          <IconButton size='small' onClick={this.clearClickHandler} className={cnFileInput('Clear')}>
            <Close fontSize='small' />
          </IconButton>
        )}

        {iconButton ? (
          <Tooltip title={buttonCaption}>
            <IconButton
              color='primary'
              ref={this.btnRef}
              onClick={this.browseClickHandler}
              className={cnFileInput('Browse')}
            >
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            ref={this.btnRef}
            onClick={this.browseClickHandler}
            className={cnFileInput('Browse')}
            children={buttonCaption}
            {...buttonProps}
          />
        )}
      </span>
    );
  }

  @computed
  private get empty(): boolean {
    return this._empty && !this.props.value;
  }

  @computed
  private get caption(): string {
    const { value, multiple } = this.props;
    const count = this.files?.length || (value && 1);

    if (!count) {
      const bl = multiple ? 'ы' : '';

      return `Файл${bl} не выбран${bl}`;
    }

    const name = this.files && this.files[0]?.name;

    return count === 1 && name
      ? name
      : `${pluralize(count, 'Выбран', 'Выбрано', 'Выбрано')} ${count} ${pluralize(count, 'файл', 'файла', 'файлов')}`;
  }

  @action.bound
  private handleChange() {
    const { onChange, autoClear } = this.props;

    this.files = this.inputRef.current.files;
    this._empty = !this.files.length;

    onChange(this.files);

    if (autoClear) {
      this.clear();
    }
  }

  @boundMethod
  private clearClickHandler() {
    this.clear();
    this.handleChange();
  }

  @action.bound
  private clear() {
    this.inputRef.current.value = '';
    this.files = null;
  }

  @boundMethod
  private browseClickHandler() {
    this.inputRef.current.click();
  }
}
