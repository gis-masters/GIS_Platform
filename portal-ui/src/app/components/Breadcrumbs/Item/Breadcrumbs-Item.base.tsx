import React, { Component, ComponentType, CSSProperties } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { BreadcrumbsItemData } from '../Breadcrumbs';
import { BreadcrumbsItemSubtitle } from '../ItemSubtitle/Breadcrumbs-ItemSubtitle';
import { BreadcrumbsItemTitle } from '../ItemTitle/Breadcrumbs-ItemTitle';
import { BreadcrumbsNestingGap } from '../NestingGap/Breadcrumbs-NestingGap';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Item.scss';

export const cnBreadcrumbsItem = cn('Breadcrumbs', 'Item');

export type BreadcrumbsItemsType = 'button' | 'link' | 'none' | 'showMore';

export interface BreadcrumbsItemProps extends BreadcrumbsItemData, IClassNameProps {
  type: BreadcrumbsItemsType;
  ContainerComponent?: ComponentType<BreadcrumbsItemProps>;
}

export class BreadcrumbsItemBase extends Component<BreadcrumbsItemProps> {
  render() {
    const { title, subtitle, nestingLevel, ContainerComponent, className, children } = this.props;

    if (!ContainerComponent) {
      throw new Error('Не указан ContainerComponent');
    }

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
