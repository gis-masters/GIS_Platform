import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { IconButton } from '../../../IconButton/IconButton';
import { cnStringControlInner, StringControlInnerBase, StringControlInnerProps } from '../StringControl-Inner.base';

@observer
class StringControlInnerDisplayPassword extends Component<StringControlInnerProps> {
  @observable private show = false;

  constructor(props: StringControlInnerProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <StringControlInnerBase
        {...this.props}
        textFieldProps={{
          type: this.show ? 'text' : 'password',
          InputProps: {
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton aria-label='Показать пароль' onClick={this.toggleShow} edge='end' size='small'>
                  {this.show ? <Visibility fontSize='small' /> : <VisibilityOff fontSize='small' />}
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    );
  }

  @action.bound
  private toggleShow() {
    this.show = !this.show;
  }
}

export const withDisplayPassword = withBemMod<StringControlInnerProps>(
  cnStringControlInner(),
  { display: 'password' },
  () => StringControlInnerDisplayPassword
);
