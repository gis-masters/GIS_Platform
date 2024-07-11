import React, { Component, createRef, FC, ForwardedRef, forwardRef, ReactNode, RefObject } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuItemProps, MenuProps } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./MenuNestedItem.scss';

const cnMenuNestedItem = cn('MenuNestedItem');

interface MenuNestedItemProps extends Omit<MenuItemProps, 'ref'> {
  parentMenuOpen: boolean;
  MenuProps?: Omit<MenuProps, 'children'>;
  innerRef?: ForwardedRef<HTMLLIElement>;
  ContainerProps?: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement | null>;
  submenu: ReactNode[];
  icon: ReactNode;
  title: string;
}

@observer
class MenuNestedItemComponent extends Component<MenuNestedItemProps> {
  @observable private submenuOpen = false;
  private containerRef: RefObject<HTMLDivElement> = createRef();
  private menuContainerRef: RefObject<HTMLDivElement> = createRef();
  private anchorRef: RefObject<HTMLSpanElement> = createRef();

  constructor(props: MenuNestedItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { ContainerProps, tabIndex, icon, title, className, innerRef, submenu, children, parentMenuOpen, ...props } =
      this.props;

    return (
      <div
        {...ContainerProps}
        ref={this.containerRef}
        onFocus={this.handleFocus}
        tabIndex={tabIndex}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onKeyDown={this.handleKeyDown}
      >
        <MenuItem className={cnMenuNestedItem(null, [className])} ref={innerRef} {...props}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{title}</ListItemText>
          <ChevronRight color='action' />
          <span className={cnMenuNestedItem('Anchor')} ref={this.anchorRef} />
        </MenuItem>

        <Menu
          className={cnMenuNestedItem('Menu')}
          anchorEl={this.anchorRef.current}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={this.submenuOpen && parentMenuOpen}
          autoFocus={false}
          disableAutoFocus
          disableEnforceFocus
          onClose={this.closeSubmenu}
        >
          <div ref={this.menuContainerRef} className={cnMenuNestedItem('MenuContainer')}>
            {submenu}
          </div>
        </Menu>
      </div>
    );
  }

  @boundMethod
  private handleFocus(e: React.FocusEvent<HTMLElement>) {
    const { ContainerProps } = this.props;

    if (e.target === this.containerRef.current) {
      this.openSubmenu();
    }

    if (ContainerProps?.onFocus) {
      ContainerProps.onFocus(e);
    }
  }

  @boundMethod
  private handleMouseEnter(e: React.MouseEvent<HTMLElement>) {
    const { ContainerProps } = this.props;

    this.openSubmenu();

    if (ContainerProps?.onMouseEnter) {
      ContainerProps.onMouseEnter(e);
    }
  }

  @boundMethod
  private handleMouseLeave(e: React.MouseEvent<HTMLElement>) {
    const { ContainerProps } = this.props;

    this.closeSubmenu();

    if (ContainerProps?.onMouseLeave) {
      ContainerProps.onMouseLeave(e);
    }
  }

  @boundMethod
  private handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      return;
    }

    if (this.isSubmenuFocused()) {
      e.stopPropagation();
    }

    const active = this.containerRef.current?.ownerDocument.activeElement;

    if (e.key === 'ArrowLeft' && this.isSubmenuFocused()) {
      this.containerRef.current?.focus();
    }

    if (e.key === 'ArrowRight' && e.target === this.containerRef.current && e.target === active) {
      const firstChild = this.menuContainerRef.current?.children[0] as HTMLElement;
      firstChild.focus();
    }
  }

  private isSubmenuFocused() {
    const active = this.containerRef.current?.ownerDocument.activeElement;

    for (const child of this.menuContainerRef.current?.children || []) {
      if (child === active) {
        return true;
      }
    }

    return false;
  }

  @action.bound
  private closeSubmenu() {
    this.submenuOpen = false;
  }

  @action
  private openSubmenu() {
    this.submenuOpen = true;
  }
}

export const MenuNestedItem: FC<Omit<MenuNestedItemProps, 'innerRef'>> = forwardRef(
  (props, ref: ForwardedRef<HTMLLIElement>) => <MenuNestedItemComponent innerRef={ref} {...props} />
);
