import { compose, HOC } from '@bem-react/core';

import { withDisplayMultiline } from './_display/StringControl-Inner_display_multiline';
import { TextControlInnerBase, TextControlInnerProps } from './TextControl-Inner.base';

export const StringControlInner = compose(withDisplayMultiline as HOC<TextControlInnerProps>)(TextControlInnerBase);
