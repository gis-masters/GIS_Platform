import React, { Component, createRef, Fragment, RefObject } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { action, computed, makeObservable, observable } from 'mobx';

import { BreadcrumbsItemData, BreadcrumbsItemsType } from './Item/Breadcrumbs-Item';
import { BreadcrumbsDivider } from './Divider/Breadcrumbs-Divider';
import { BreadcrumbsItem } from './Item/Breadcrumbs-Item.composed';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs.scss';

const cnBreadcrumbs = cn('Breadcrumbs');

const MIN_BREADCRUMB_ITEM_LENGTH = 80;
const BREADCRUMB_DIVIDER_LENGTH = 33;

interface BreadcrumbsProps<T> extends IClassNameProps {
  itemsType: BreadcrumbsItemsType;
  items: BreadcrumbsItemData<T>[];
  maxWidth?: number;
}

@observer
export class Breadcrumbs<T> extends Component<BreadcrumbsProps<T>> {
  @observable private showMoreList: BreadcrumbsItemData<T>[];
  @observable private itemsNumber = 1;
  @observable private contentBoxSize: number;

  private container: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.handleResize);

  constructor(props: BreadcrumbsProps<T>) {
    super(props);
    makeObservable(this);

    this.container = React.createRef();
  }

  componentDidMount() {
    this.updateItems();

    this.resizeObserver.observe(this.container.current);
  }

  componentDidUpdate() {
    this.updateItems();
  }

  componentWillUnmount() {
    this.resizeObserver.unobserve(this.container.current);
  }

  render() {
    const { itemsType, className, maxWidth: maxLength } = this.props;

    return (
      <div className={cnBreadcrumbs(null, [className])} ref={this.container} style={{ width: maxLength }}>
        {this.breadcrumbs?.map((item, i) => (
          <Fragment key={i}>
            <>
              {item.showMore && (
                <>
                  <BreadcrumbsItem showMoreList={this.showMoreList} type={'showMore'} />
                  <BreadcrumbsDivider />
                </>
              )}

              {item.showMore === undefined && (
                <>
                  <BreadcrumbsItem {...item} type={itemsType} />
                  {i !== this.breadcrumbs.length - 1 && <BreadcrumbsDivider />}
                </>
              )}
            </>
          </Fragment>
        ))}
      </div>
    );
  }

  @boundMethod
  private checkItemsFit() {
    const children = this.container?.current?.children;

    if (children) {
      const lastChildWidth = children[children.length - 1].children[0].clientWidth;

      if (lastChildWidth > MIN_BREADCRUMB_ITEM_LENGTH) {
        this.setItemsNumber(this.itemsNumber + 1);
      } else if (lastChildWidth <= MIN_BREADCRUMB_ITEM_LENGTH) {
        this.setItemsNumber(this.itemsNumber - 1);
      }
    }
  }

  @boundMethod
  private handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      const contentBoxSize = (
        Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize
      ) as ResizeObserverSize;

      if (!this.contentBoxSize) {
        this.setContentBoxSize(contentBoxSize.inlineSize);
      }

      if (this.contentBoxSize && Math.abs(this.contentBoxSize - contentBoxSize.inlineSize) > 5) {
        this.checkItemsFit();
        this.setContentBoxSize(contentBoxSize.inlineSize);
      }
    }
  }

  @action
  private setItemsNumber(itemsNumber: number) {
    if (itemsNumber > 0 && itemsNumber <= this.props.items.length) {
      this.itemsNumber = itemsNumber;
    }
  }

  @action
  private setContentBoxSize(contentBoxSize: number) {
    this.contentBoxSize = contentBoxSize;
  }

  @action
  private setBreadcrumbsSubList(showMoreList: BreadcrumbsItemData<T>[]) {
    this.showMoreList = showMoreList;
  }

  @computed
  private get breadcrumbs(): BreadcrumbsItemData<T>[] {
    const { items } = this.props;

    if (this.itemsNumber === 1) {
      this.setBreadcrumbsSubList(items.slice(0, -1));

      return [{ showMore: items.length > 1 }, items[items.length - 1]];
    }

    if (this.itemsNumber === 2) {
      this.setBreadcrumbsSubList(items.slice(1, -1));

      return [items[0], { showMore: items.length > 2 }, items[items.length - 1]];
    }

    if (this.itemsNumber === items.length) {
      return [...items];
    }

    if (this.itemsNumber > 2) {
      this.setBreadcrumbsSubList(items.slice(1, -(this.itemsNumber - 1)));

      return [
        items[0],
        { showMore: items.length > this.itemsNumber },
        ...items.slice(-(this.itemsNumber - 1), items.length)
      ];
    }

    return items;
  }

  private updateItems() {
    const { items } = this.props;

    for (let i = 0; i < items.length; i++) {
      const itemsLength = (items.length - i) * MIN_BREADCRUMB_ITEM_LENGTH + items.length * BREADCRUMB_DIVIDER_LENGTH;

      if (this.container.current.clientWidth > itemsLength) {
        this.setItemsNumber(items.length - i);

        break;
      }
    }
  }
}
