import { HOC, compose } from '@bem-react/core';

import { ActionsBase, ActionsProps } from './Actions.base';
import { asMenu } from './_as/Actions_as_menu';

export const Actions = compose(asMenu as HOC<ActionsProps>)(ActionsBase);
