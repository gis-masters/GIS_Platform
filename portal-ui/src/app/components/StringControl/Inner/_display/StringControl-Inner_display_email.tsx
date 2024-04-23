import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { cnStringControlInner, StringControlInnerBase, StringControlInnerProps } from '../StringControl-Inner.base';

@observer
class StringControlInnerDisplayEmail extends Component<StringControlInnerProps> {
  render() {
    return (
      <StringControlInnerBase
        {...this.props}
        textFieldProps={{
          type: 'email'
        }}
        onChange={this.handleChange}
      />
    );
  }

  @boundMethod
  private handleChange(value: string) {
    this.props.onChange(value.trim());
  }
}

export const withDisplayEmail = withBemMod<StringControlInnerProps>(
  cnStringControlInner(),
  { display: 'email' },
  () => StringControlInnerDisplayEmail
);
