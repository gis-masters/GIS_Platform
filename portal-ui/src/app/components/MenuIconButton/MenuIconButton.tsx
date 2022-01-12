import React, { Component, createRef, RefObject } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ArrowDropDown } from '@mui/icons-material';
import { Menu, PropTypes } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { IconButton, IconButtonProps } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./MenuIconButton.scss';

const cnMenuIconButton = cn('MenuIconButton');

interface MenuIconButtonProps extends IconButtonProps {
  Icon: React.ElementType<IClassNameProps>;
  color?: PropTypes.Color;
}

@observer
export class MenuIconButton extends Component<MenuIconButtonProps> {
  private buttonRef: RefObject<HTMLButtonElement> = createRef();
  @observable private menuOpen = false;
  private anchorEl: HTMLButtonElement;

  render() {
    const { Icon, color = 'default', children, className, ...iconButtonProps } = this.props;

    return (
      <>
        <IconButton
          {...iconButtonProps}
          className={cnMenuIconButton(null, [className])}
          buttonRef={this.buttonRef}
          color={color}
          onClick={this.toggle}
        >
          <Icon className={cnMenuIconButton('Icon')} />
          <ArrowDropDown className={cnMenuIconButton('Arrow', { up: this.menuOpen })} />
        </IconButton>
        <Menu open={this.menuOpen} onClose={this.close} anchorEl={this.anchorEl} onClick={this.close}>
          {children}
        </Menu>
      </>
    );
  }

  @action.bound
  private toggle() {
    this.anchorEl = this.buttonRef.current;
    this.menuOpen = !this.menuOpen;
  }

  @action.bound
  private close() {
    this.menuOpen = false;
  }
}
