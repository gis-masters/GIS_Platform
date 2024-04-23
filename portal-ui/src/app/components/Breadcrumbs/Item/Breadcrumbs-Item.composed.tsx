import { compose, composeU } from '@bem-react/core';

import { withTypeButton } from './_type/Breadcrumbs-Item_type_button';
import { withTypeLink } from './_type/Breadcrumbs-Item_type_link';
import { withTypeNone } from './_type/Breadcrumbs-Item_type_none';
import { BreadcrumbsItemBase } from './Breadcrumbs-Item.base';

export const BreadcrumbsItem = compose(composeU(withTypeButton, withTypeLink, withTypeNone))(BreadcrumbsItemBase);
