import { compose } from '@bem-react/core';

import { ActionsItemBase } from './Actions-Item.base';
import { asButton } from './_as/Actions-Item_as_button';
import { asIconButton } from './_as/Actions-Item_as_iconButton';
import { asMenu } from './_as/Actions-Item_as_menu';

export const ActionsItem = compose(asButton, asIconButton, asMenu)(ActionsItemBase) as typeof ActionsItemBase;
