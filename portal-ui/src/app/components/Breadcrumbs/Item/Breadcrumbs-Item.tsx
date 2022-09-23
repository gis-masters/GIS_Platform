import React, { Component, ComponentType, CSSProperties, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import { BreadcrumbsItemTitle } from '../ItemTitle/Breadcrumbs-ItemTitle';
import { BreadcrumbsNestingGap } from '../NestingGap/Breadcrumbs-NestingGap';
import { BreadcrumbsItemSubtitle } from '../ItemSubtitle/Breadcrumbs-ItemSubtitle';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Item.scss';

export const cnBreadcrumbsItem = cn('Breadcrumbs', 'Item');

export type BreadcrumbsItemsType = 'button' | 'link' | 'none' | 'showMore';

export interface BreadcrumbsItemData<T = unknown> extends ChildrenProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  url?: string;
  showMoreList?: BreadcrumbsItemData<T>[];
  nestingLevel?: number;
  payload?: T;
  style?: CSSProperties;
  onClick?: (payload: T) => void;
}

export interface BreadcrumbsItemProps<T = unknown> extends BreadcrumbsItemData<T>, IClassNameProps {
  type: BreadcrumbsItemsType;
  ContainerComponent?: ComponentType<BreadcrumbsItemProps>;
}

export class BreadcrumbsItem<T> extends Component<BreadcrumbsItemProps<T>> {
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
