import { compose, HOC } from '@bem-react/core';

import { asMenu } from './_as/Actions_as_menu';
import { ActionsBase, ActionsProps } from './Actions.base';

export const Actions = compose(asMenu as HOC<ActionsProps>)(ActionsBase);
