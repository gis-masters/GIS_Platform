import React, { Component, Fragment } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { BreadcrumbsItemData, BreadcrumbsItemsType } from './Item/Breadcrumbs-Item';
import { BreadcrumbsItem } from './Item/Breadcrumbs-Item.composed';
import { BreadcrumbsDivider } from './Divider/Breadcrumbs-Divider';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs.scss';

const cnBreadcrumbs = cn('Breadcrumbs');

interface BreadcrumbsProps<T> extends IClassNameProps {
  itemsType: BreadcrumbsItemsType;
  items: BreadcrumbsItemData<T>[];
}

export class Breadcrumbs<T> extends Component<BreadcrumbsProps<T>> {
  render() {
    const { items, itemsType, className } = this.props;

    return (
      <div className={cnBreadcrumbs(null, [className])}>
        {items.map((item, i) => (
          <Fragment key={i}>
            {Boolean(i) && <BreadcrumbsDivider />}
            <BreadcrumbsItem {...item} type={itemsType} />
          </Fragment>
        ))}
      </div>
    );
  }
}
