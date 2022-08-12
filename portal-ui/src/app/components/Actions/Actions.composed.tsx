import { compose } from '@bem-react/core';

import { ActionsBase } from './Actions.base';
import { asMenu } from './_as/Actions_as_menu';

export const Actions = compose(asMenu)(ActionsBase) as typeof ActionsBase;
