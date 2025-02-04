import React, { Component, createRef, FC, ForwardedRef, forwardRef, ReactNode, RefObject } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Button, ButtonProps } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./MenuButton.scss';

const cnMenuButton = cn('MenuButton');

interface MenuButtonProps extends Omit<ButtonProps, 'ref'> {
  innerRef?: ForwardedRef<HTMLButtonElement>;
  menu: ReactNode;
}

@observer
class MenuButtonComponent extends Component<MenuButtonProps> {
  private anchorRef: RefObject<HTMLButtonElement> = createRef();
  @observable private menuOpen = false;
  private anchorEl: HTMLButtonElement | null = null;

  constructor(props: MenuButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { children, className, innerRef, menu, ...buttonProps } = this.props;

    return (
      <>
        <Button
          className={cnMenuButton(null, [className])}
          ref={innerRef}
          {...buttonProps}
          onClick={this.toggle}
          endIcon={<KeyboardArrowDown />}
        >
          {children}
          <span className={cnMenuButton('Anchor')} ref={this.anchorRef} />
        </Button>
        <Menu open={this.menuOpen} onClose={this.close} anchorEl={this.anchorEl} onClick={this.close}>
          {menu}
        </Menu>
      </>
    );
  }

  @action.bound
  private toggle() {
    this.anchorEl = this.anchorRef.current;
    this.menuOpen = !this.menuOpen;
  }

  @action.bound
  private close() {
    this.menuOpen = false;
  }
}

export const MenuButton: FC<Omit<MenuButtonProps, 'innerRef'>> = forwardRef(
  (props, ref: ForwardedRef<HTMLButtonElement>) => <MenuButtonComponent innerRef={ref} {...props} />
);
