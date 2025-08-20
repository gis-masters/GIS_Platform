import { compose, HOC } from '@bem-react/core';

import { withDisplayCode } from './_display/StringControl-Inner_display_code';
import { withDisplayEmail } from './_display/StringControl-Inner_display_email';
import { withDisplayMultiline } from './_display/StringControl-Inner_display_multiline';
import { withDisplayPassword } from './_display/StringControl-Inner_display_password';
import { withDisplayPhone } from './_display/StringControl-Inner_display_phone';
import { StringControlInnerBase, StringControlInnerProps } from './StringControl-Inner.base';

export const StringControlInner = compose(
  withDisplayPassword as HOC<StringControlInnerProps>,
  withDisplayPhone as HOC<StringControlInnerProps>,
  withDisplayEmail as HOC<StringControlInnerProps>,
  withDisplayMultiline as HOC<StringControlInnerProps>,
  withDisplayCode as HOC<StringControlInnerProps>
)(StringControlInnerBase);
