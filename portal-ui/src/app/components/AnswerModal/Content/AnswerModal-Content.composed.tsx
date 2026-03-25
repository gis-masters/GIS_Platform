import { compose, type HOC } from '@bem-react/core';

import { withTypeFormPrompt } from './_type/AnswerModal-Content_type_formPrompt';
import { withTypePrompt } from './_type/AnswerModal-Content_type_prompt';
import { AnswerModalContentBase, type AnswerModalContentProps } from './AnswerModal-Content.base';

export const AnswerModalContent = compose(
  withTypePrompt as HOC<AnswerModalContentProps>,
  withTypeFormPrompt as HOC<AnswerModalContentProps>
)(AnswerModalContentBase);
