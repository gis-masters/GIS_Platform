import { compose, HOC } from '@bem-react/core';

import { withTypeFormPrompt } from './_type/UtilityDialog-Content_type_formPrompt';
import { withTypePrompto } from './_type/UtilityDialog-Content_type_prompto';
import { UtilityDialogContentBase, UtilityDialogContentProps } from './UtilityDialog-Content.base';

export const UtilityDialogContent = compose(
  withTypePrompto as HOC<UtilityDialogContentProps>,
  withTypeFormPrompt as HOC<UtilityDialogContentProps>
)(UtilityDialogContentBase);
