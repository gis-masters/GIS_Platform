import React, { Component, createRef, DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
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
  @observable private caption = '';
  @observable private empty = true;

  componentDidMount() {
    this.handleChange();
  }

  render() {
    const { className, onChange, fullWidth, ...otherProps } = this.props;

    return (
      <span className={cnFileInput({ fullWidth, empty: this.empty }, [className])}>
        <span className={cnFileInput('Filename')}>{this.caption}</span>
        <input
          type='file'
          accept={'text/xml'}
          className={cnFileInput('Input')}
          ref={this.inputRef}
          {...otherProps}
          onChange={this.handleChange}
          tabIndex={-1}
        />
        {!this.empty && (
          <IconButton size='small' tabIndex='-1' onClick={this.clearClickHandler} className={cnFileInput('Clear')}>
            <Close fontSize='small' />
          </IconButton>
        )}
        <Button innerRef={this.btnRef} onClick={this.browseClickHandler} className={cnFileInput('Browse')}>
          Выбрать
        </Button>
      </span>
    );
  }

  @action.bound
  private handleChange(e?: React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;
    const files = this.inputRef.current.files;
    const initial = !this.caption;

    if (files.length === 1) {
      this.caption = files[0].name;
      this.empty = false;
    } else if (files.length > 1) {
      this.empty = false;
      this.caption = `Выбрано ${files.length} ${pluralize(files.length, 'файл', 'файла', 'файлов')}`;
    } else {
      this.empty = true;
      this.caption = 'Файл не выбран';
    }

    if (!initial && onChange) {
      onChange(files);
    }
  }

  @boundMethod
  private clearClickHandler() {
    this.inputRef.current.value = '';
    this.handleChange();
  }

  @boundMethod
  private browseClickHandler() {
    this.inputRef.current.click();
  }
}
