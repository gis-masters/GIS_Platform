import React, { Component, ComponentType, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { BreadcrumbsItemTitle } from '../ItemTitle/Breadcrumbs-ItemTitle';
import { BreadcrumbsItemSubtitle } from '../ItemSubtitle/Breadcrumbs-ItemSubtitle';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs-Item.scss';

export const cnBreadcrumbsItem = cn('Breadcrumbs', 'Item');

export type BreadcrumbsItemsType = 'button' | 'link' | 'none';

export interface BreadcrumbsItemData<T = unknown> {
  title: ReactNode;
  subtitle?: ReactNode;
  url?: string;
  onClick?: (payload: T) => void;
  payload?: T;
}

export interface BreadcrumbsItemProps<T = unknown> extends BreadcrumbsItemData<T>, IClassNameProps {
  type: BreadcrumbsItemsType;
  ContainerComponent?: ComponentType<BreadcrumbsItemProps>;
}

export class BreadcrumbsItem<T> extends Component<BreadcrumbsItemProps<T>> {
  render() {
    const { title, subtitle, ContainerComponent } = this.props;

    return (
      <ContainerComponent {...this.props} className={cnBreadcrumbsItem()}>
        <BreadcrumbsItemTitle>{title}</BreadcrumbsItemTitle>
        <BreadcrumbsItemSubtitle>{subtitle}</BreadcrumbsItemSubtitle>
      </ContainerComponent>
    );
  }
}
