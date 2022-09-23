import React, { Component, createRef, Fragment, RefObject } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { sleep } from '../../services/util/sleep';

import { BreadcrumbsItemData, BreadcrumbsItemsType } from './Item/Breadcrumbs-Item';
import { BreadcrumbsDivider } from './Divider/Breadcrumbs-Divider';
import { BreadcrumbsItem } from './Item/Breadcrumbs-Item.composed';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs.scss';

const cnBreadcrumbs = cn('Breadcrumbs');

const WHEN_ITEMS_HIDE = 150;
const WHEN_ITEMS_SHOW = 250;

export interface BreadcrumbsProps<T = unknown> extends IClassNameProps {
  itemsType: BreadcrumbsItemsType;
  items: BreadcrumbsItemData<T>[];
  size?: 'small' | 'medium';
}

@observer
export class Breadcrumbs<T> extends Component<BreadcrumbsProps<T>> {
  @observable private hiddenItemsCount = 0;
  @observable private contentBoxSize: number;

  private container: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.handleResize);

  constructor(props: BreadcrumbsProps<T>) {
    super(props);
    makeObservable(this);

    this.container = React.createRef();
  }

  async componentDidMount() {
    await this.checkItemsFit();
    this.resizeObserver.observe(this.container.current);
  }

  async componentDidUpdate(prevProps: BreadcrumbsProps<T>) {
    const { items } = this.props;
    if (!isEqual(items, prevProps.items)) {
      await this.checkItemsFit();
    }
  }

  componentWillUnmount() {
    this.resizeObserver.unobserve(this.container.current);
  }

  render() {
    const { itemsType, className, size = 'medium' } = this.props;

    return (
      <div className={cnBreadcrumbs({ size }, [className])} ref={this.container}>
        {this.items?.map((item, i) => (
          <Fragment key={i}>
            <>
              {item?.showMoreList && (
                <>
                  <BreadcrumbsItem showMoreList={item.showMoreList} type={'showMore'} />
                  <BreadcrumbsDivider />
                </>
              )}

              {!item?.showMoreList && (
                <>
                  <BreadcrumbsItem {...item} type={itemsType} />
                  {i !== this.items.length - 1 && <BreadcrumbsDivider />}
                </>
              )}
            </>
          </Fragment>
        ))}
      </div>
    );
  }

  @boundMethod
  private async checkItemsFit() {
    let wasHiddenItemsCount: number;
    let diff = 0;

    do {
      wasHiddenItemsCount = this.hiddenItemsCount;

      const itemsElements = [
        ...(this.container?.current?.querySelectorAll('.' + cnBreadcrumbs('Item')) || [])
      ] as HTMLElement[];
      const shrunkItems = itemsElements.filter(
        el => el.offsetWidth < el.querySelector('.' + cnBreadcrumbs('ItemTitle'))?.scrollWidth
      );
      const shrunkItemsAverageWidth = shrunkItems.reduce((acc, item) => acc + item.offsetWidth, 0) / shrunkItems.length;

      if (shrunkItems.length && shrunkItemsAverageWidth < WHEN_ITEMS_HIDE && diff >= 0) {
        this.setHiddenItemsCount(this.hiddenItemsCount + 1);
        diff++;
      }

      if (this.hiddenItemsCount && (!shrunkItems.length || shrunkItemsAverageWidth > WHEN_ITEMS_SHOW) && diff <= 0) {
        this.setHiddenItemsCount(this.hiddenItemsCount - 1);
        diff--;
      }

      await sleep(50); // даём браузеру отрендерить изменения
    } while (wasHiddenItemsCount !== this.hiddenItemsCount && Math.abs(diff) < 50);
  }

  @boundMethod
  private async handleResize(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      const contentBoxSize = (
        Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize
      ) as ResizeObserverSize;

      if (!this.contentBoxSize) {
        this.setContentBoxSize(contentBoxSize.inlineSize);
      }

      if (this.contentBoxSize && Math.abs(this.contentBoxSize - contentBoxSize.inlineSize) > 5) {
        await this.checkItemsFit();
        this.setContentBoxSize(contentBoxSize.inlineSize);
      }
    }
  }

  @action
  private setHiddenItemsCount(count: number) {
    if (count >= 0 && count < this.props.items.length) {
      this.hiddenItemsCount = count;
    }
  }

  @action
  private setContentBoxSize(contentBoxSize: number) {
    this.contentBoxSize = contentBoxSize;
  }

  @computed
  private get items(): BreadcrumbsItemData<T>[] {
    const items = [...this.props.items];
    const result: BreadcrumbsItemData<T>[] = [];

    if (this.hiddenItemsCount < items.length - 1) {
      result.push(...items.splice(0, 1));
    }

    if (this.hiddenItemsCount) {
      result.push({ showMoreList: items.splice(0, this.hiddenItemsCount) });
    }

    result.push(...items);

    return result;
  }
}
