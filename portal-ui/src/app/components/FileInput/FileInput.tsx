import React, { Component, createRef, DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';

import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./FileInput.scss';

const cnFileInput = cn('FileInput');

interface FileInputProps
  extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  onChange?: (selectedFiles: FileList | null) => void;
  fullWidth?: boolean;
}

@observer
export class FileInput extends Component<FileInputProps> {
  private inputRef: RefObject<HTMLInputElement> = createRef();
  private btnRef: RefObject<HTMLButtonElement> = createRef();
  @observable private _empty = true;
  @observable private files: FileList | null = null;

  render() {
    const { className, onChange, fullWidth, value, ...otherProps } = this.props;

    return (
      <span className={cnFileInput({ fullWidth, empty: this.empty }, [className])}>
        <span className={cnFileInput('Filename')}>{this.caption}</span>
        <input
          type='file'
          className={cnFileInput('Input')}
          ref={this.inputRef}
          {...otherProps}
          onChange={this.handleChange}
          tabIndex={-1}
        />
        {!this.empty && (
          <IconButton size='small' onClick={this.clearClickHandler} className={cnFileInput('Clear')}>
            <Close fontSize='small' />
          </IconButton>
        )}
        <Button btnRef={this.btnRef} onClick={this.browseClickHandler} className={cnFileInput('Browse')}>
          Выбрать
        </Button>
      </span>
    );
  }

  @computed
  private get empty(): boolean {
    return this._empty && !this.props.value;
  }

  @computed
  private get caption(): string {
    const count = this.files?.length || (this.props.value && 1);

    if (!count) {
      return 'Файл не выбран';
    }

    const name = this.files && this.files[0]?.name;

    return count === 1 && name
      ? name
      : `${pluralize(count, 'Выбран', 'Выбрано', 'Выбрано')} ${count} ${pluralize(count, 'файл', 'файла', 'файлов')}`;
  }

  @action.bound
  private handleChange() {
    const { onChange } = this.props;

    this.files = this.inputRef.current.files;
    this._empty = !this.files.length;

    onChange(this.files);
  }

  @action.bound
  private clearClickHandler() {
    this.inputRef.current.value = '';
    this.files = null;
    this.handleChange();
  }

  @boundMethod
  private browseClickHandler() {
    this.inputRef.current.click();
  }
}
