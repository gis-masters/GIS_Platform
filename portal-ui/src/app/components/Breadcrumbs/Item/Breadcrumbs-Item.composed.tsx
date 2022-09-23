import { compose, composeU } from '@bem-react/core';
import { BreadcrumbsItem as Presenter } from './Breadcrumbs-Item';

import { withTypeButton } from './_type/Breadcrumbs-Item_type_button';
import { withTypeLink } from './_type/Breadcrumbs-Item_type_link';
import { withTypeShowMore } from './_type/Breadcrumbs-Item_type_showMore';
import { withTypeNone } from './_type/Breadcrumbs-Item_type_none';

export const BreadcrumbsItem = compose(composeU(withTypeButton, withTypeLink, withTypeNone, withTypeShowMore))(
  Presenter
) as typeof Presenter;
