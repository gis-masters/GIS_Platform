import React, { Component, createRef, CSSProperties, Fragment, ReactNode, RefObject } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu, MenuItem } from '@mui/material';
import { SegmentOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { isEqual, throttle } from 'lodash';

import { sleep } from '../../services/util/sleep';
import { ChildrenProps } from '../../services/models';
import { IconButton } from '../IconButton/IconButton';

import { BreadcrumbsShowMore } from './ShowMore/Breadcrumbs-ShowMore';
import { BreadcrumbsItemsType } from './Item/Breadcrumbs-Item.base';
import { BreadcrumbsDivider } from './Divider/Breadcrumbs-Divider';
import { BreadcrumbsItem } from './Item/Breadcrumbs-Item.composed';

import '!style-loader!css-loader!sass-loader!./Breadcrumbs.scss';
import '!style-loader!css-loader!sass-loader!./ShowMoreMenu/Breadcrumbs-ShowMoreMenu.scss';
import '!style-loader!css-loader!sass-loader!./ShowMoreMenuRoot/Breadcrumbs-ShowMoreMenuRoot.scss';

const cnBreadcrumbs = cn('Breadcrumbs');

const WHEN_ITEMS_HIDE = 150;
const WHEN_ITEMS_SHOW = 250;

export interface BreadcrumbsItemData<T = unknown> extends ChildrenProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  url?: string;
  nestingLevel?: number;
  payload?: T;
  style?: CSSProperties;
  onClick?: (payload: T) => void;
}

export interface BreadcrumbsProps<T = unknown> extends IClassNameProps {
  itemsType: BreadcrumbsItemsType;
  items: BreadcrumbsItemData<T>[];
  size?: 'small' | 'medium';
  menuButtonOnly?: boolean;
}

@observer
export default class Breadcrumbs<T> extends Component<BreadcrumbsProps<T>> {
  @observable private hiddenItemsCount = 0;
  @observable private contentBoxSize: number;
  @observable private menuAnchorEl: HTMLElement | null = null;
  private debouncedMouseMoveHandler: (e: MouseEvent) => void;

  private containerRef: RefObject<HTMLDivElement> = createRef();
  private menuRef: RefObject<HTMLDivElement> = createRef();
  private resizeObserver: ResizeObserver = new ResizeObserver(this.handleResize);

  constructor(props: BreadcrumbsProps<T>) {
    super(props);
    makeObservable(this);

    this.debouncedMouseMoveHandler = throttle(this.handleMouseMove.bind(this), 100);
  }

  async componentDidMount() {
    await this.checkItemsFit();
    if (this.containerRef.current) {
      this.resizeObserver.observe(this.containerRef.current);
    }

    document.body.addEventListener('mousemove', this.debouncedMouseMoveHandler);
  }

  async componentDidUpdate(prevProps: BreadcrumbsProps<T>) {
    const { items } = this.props;
    if (!isEqual(items, prevProps.items)) {
      await this.checkItemsFit();
    }
  }

  componentWillUnmount() {
    this.resizeObserver.unobserve(this.containerRef.current);
    document.body.removeEventListener('mousemove', this.debouncedMouseMoveHandler);
  }

  render() {
    const { itemsType, className, size = 'medium', items, menuButtonOnly } = this.props;

    return (
      <>
        <div
          className={cnBreadcrumbs({ size, menuButtonOnly, menuOpen: !!this.menuAnchorEl }, [className])}
          ref={this.containerRef}
          onMouseOver={this.openMenu}
        >
          {this.rootHidden && <BreadcrumbsDivider down edge />}
          {this.visibleItems?.map((item, i) => (
            <Fragment key={i}>
              {!this.rootHidden && !!this.hiddenItemsCount && i === 1 && (
                <>
                  <BreadcrumbsShowMore />
                  <BreadcrumbsDivider />
                </>
              )}
              <BreadcrumbsItem {...item} type={itemsType} />
              {i !== this.visibleItems.length - 1 && <BreadcrumbsDivider />}
            </Fragment>
          ))}

          {menuButtonOnly && (
            <IconButton size={size}>
              <SegmentOutlined fontSize={size} />
            </IconButton>
          )}
        </div>

        <Menu
          open={!!this.menuAnchorEl && (menuButtonOnly || !!this.hiddenItemsCount)}
          anchorEl={this.menuAnchorEl}
          PaperProps={{ ref: this.menuRef }}
          className={cnBreadcrumbs('ShowMoreMenuRoot')}
          onClose={this.closeMenu}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          MenuListProps={{ className: cnBreadcrumbs('ShowMoreMenu') }}
          hideBackdrop
        >
          {items?.map((item, i) => (
            <MenuItem key={i} onClick={this.closeMenu}>
              <BreadcrumbsItem {...item} nestingLevel={i && i + 1} type={'button'} />
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  @action.bound
  private openMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.menuAnchorEl = e.currentTarget as HTMLDivElement;
  }

  @action.bound
  private closeMenu() {
    this.menuAnchorEl = null;
  }

  private handleMouseMove(e: MouseEvent) {
    const { clientX, clientY } = e;

    if (
      !this.intersects(clientX, clientY, this.containerRef.current) &&
      !this.intersects(clientX, clientY, this.menuRef.current)
    ) {
      this.closeMenu();
    }
  }

  private intersects(clientX: number, clientY: number, element?: HTMLElement): boolean {
    if (!element) {
      return false;
    }

    const { x, y, width, height } = element.getClientRects().item(0);

    return clientX > x && clientX < x + width && clientY > y && clientY < y + height;
  }

  @boundMethod
  private async checkItemsFit() {
    let wasHiddenItemsCount: number;
    let diff = 0;

    do {
      wasHiddenItemsCount = this.hiddenItemsCount;

      const itemsElements = [
        ...(this.containerRef?.current?.querySelectorAll('.' + cnBreadcrumbs('Item')) || [])
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
  private get rootHidden(): boolean {
    return !(this.hiddenItemsCount < this.props.items.length - 1) && this.props.items.length > 1;
  }

  @computed
  private get visibleItems(): BreadcrumbsItemData<T>[] {
    const { menuButtonOnly, items } = this.props;
    if (menuButtonOnly) {
      return [];
    }
    const clonedItems = [...items];
    const result: BreadcrumbsItemData<T>[] = [];

    if (!this.rootHidden) {
      result.push(...clonedItems.splice(0, 1));
    }

    if (this.hiddenItemsCount) {
      clonedItems.splice(0, this.hiddenItemsCount);
    }

    result.push(...clonedItems);

    return result;
  }
}
