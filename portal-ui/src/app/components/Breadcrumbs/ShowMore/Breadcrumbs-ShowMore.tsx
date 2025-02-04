import React, { FC } from 'react';
import { MoreHoriz } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-ShowMore.scss';

const cnBreadcrumbsShowMore = cn('Breadcrumbs', 'ShowMore');

export const BreadcrumbsShowMore: FC = () => <MoreHoriz className={cnBreadcrumbsShowMore()} fontSize='inherit' />;
