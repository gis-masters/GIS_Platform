import { compose, composeU } from '@bem-react/core';
import { BreadcrumbsItem as BreadcrumbsItemPresenter } from './Breadcrumbs-Item';

import { withTypeButton } from './_type/Breadcrumbs-Item_type_button';
import { withTypeLink } from './_type/Breadcrumbs-Item_type_link';
import { withTypeNone } from './_type/Breadcrumbs-Item_type_none';

export const BreadcrumbsItem = compose(composeU(withTypeButton, withTypeLink, withTypeNone))(BreadcrumbsItemPresenter);
