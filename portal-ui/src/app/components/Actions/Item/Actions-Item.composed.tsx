import { compose, HOC } from '@bem-react/core';

import { asButton } from './_as/Actions-Item_as_button';
import { asIconButton } from './_as/Actions-Item_as_iconButton';
import { asMenu } from './_as/Actions-Item_as_menu';
import { ActionsItemBase, ActionsItemProps } from './Actions-Item.base';

export const ActionsItem = compose(
  asButton as HOC<ActionsItemProps>,
  asIconButton as HOC<ActionsItemProps>,
  asMenu as HOC<ActionsItemProps>
)(ActionsItemBase) as typeof ActionsItemBase;
