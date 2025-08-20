import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { cnStringControlInner, StringControlInnerBase, StringControlInnerProps } from '../StringControl-Inner.base';

const StringControlInnerDisplayMultiline: FC<StringControlInnerProps> = props => (
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

export const withDisplayMultiline = withBemMod<StringControlInnerProps>(
  cnStringControlInner(),
  { display: 'multiline' },
  () => StringControlInnerDisplayMultiline
);
