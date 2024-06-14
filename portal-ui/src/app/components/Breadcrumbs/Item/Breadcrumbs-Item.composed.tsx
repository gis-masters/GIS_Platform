import { compose, composeU, HOC } from '@bem-react/core';

import { withTypeButton } from './_type/Breadcrumbs-Item_type_button';
import { withTypeLink } from './_type/Breadcrumbs-Item_type_link';
import { withTypeNone } from './_type/Breadcrumbs-Item_type_none';
import { BreadcrumbsItemBase, BreadcrumbsItemProps } from './Breadcrumbs-Item.base';

export const BreadcrumbsItem = compose(
  composeU(
    withTypeButton as HOC<BreadcrumbsItemProps>,
    withTypeLink as HOC<BreadcrumbsItemProps>,
    withTypeNone as HOC<BreadcrumbsItemProps>
  )
)(BreadcrumbsItemBase);
