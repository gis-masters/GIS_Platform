import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { StringControlInnerBase, StringControlInnerProps, cnStringControlInner } from '../StringControl-Inner.base';

import '!style-loader!css-loader!sass-loader!./StringControl-Inner_display_code.scss';

const StringControlInnerDisplayCode: FC<StringControlInnerProps> = props => (
  <StringControlInnerBase
    {...props}
    textFieldProps={{
      inputProps: { className: 'scroll' },
      multiline: true,
      minRows: 2,
      maxRows: 10
    }}
  />
);

export const withDisplayCode = withBemMod<StringControlInnerProps>(
  cnStringControlInner(),
  { display: 'code' },
  () => StringControlInnerDisplayCode
);
