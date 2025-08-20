import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { cnTextControlInner, TextControlInnerBase, TextControlInnerProps } from '../TextControl-Inner.base';

const StringControlInnerDisplayMultiline: FC<TextControlInnerProps> = props => <TextControlInnerBase {...props} />;

export const withDisplayMultiline = withBemMod<TextControlInnerProps>(
  cnTextControlInner(),
  { display: 'multiline' },
  () => StringControlInnerDisplayMultiline
);
