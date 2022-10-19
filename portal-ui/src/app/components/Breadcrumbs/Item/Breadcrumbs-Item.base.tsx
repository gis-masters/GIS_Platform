import React, { Component, ComponentType, CSSProperties } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { BreadcrumbsItemData } from '../Breadcrumbs';
import { BreadcrumbsItemTitle } from '../ItemTitle/Breadcrumbs-ItemTitle';
import { BreadcrumbsNestingGap } from '../NestingGap/Breadcrumbs-NestingGap';
import { BreadcrumbsItemSubtitle } from '../ItemSubtitle/Breadcrumbs-ItemSubtitle';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Item.scss';

export const cnBreadcrumbsItem = cn('Breadcrumbs', 'Item');

export type BreadcrumbsItemsType = 'button' | 'link' | 'none' | 'showMore';

export interface BreadcrumbsItemProps<T = unknown> extends BreadcrumbsItemData<T>, IClassNameProps {
  type: BreadcrumbsItemsType;
  ContainerComponent?: ComponentType<BreadcrumbsItemProps>;
}

export class BreadcrumbsItemBase<T> extends Component<BreadcrumbsItemProps<T>> {
  render() {
    const { title, subtitle, nestingLevel, ContainerComponent, className, children } = this.props;

    return (
      <ContainerComponent
        {...this.props}
        className={cnBreadcrumbsItem(null, [className])}
        style={{ '--BreadcrumbsItemNestingLevel': nestingLevel } as CSSProperties}
      >
        {!!nestingLevel && <BreadcrumbsNestingGap />}
        {children || (
          <>
            <BreadcrumbsItemTitle>{title}</BreadcrumbsItemTitle>
            <BreadcrumbsItemSubtitle>{subtitle}</BreadcrumbsItemSubtitle>
          </>
        )}
      </ContainerComponent>
    );
  }
}
