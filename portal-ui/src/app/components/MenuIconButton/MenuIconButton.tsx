import React, { Component, createRef, RefObject } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ArrowDropDown, SvgIconComponent } from '@material-ui/icons';
import { IconButton, Menu, PropTypes } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./MenuIconButton.scss';

const cnMenuIconButton = cn('MenuIconButton');

interface MenuIconButtonProps {
  Icon: SvgIconComponent;
  color?: PropTypes.Color;
}

@observer
export class MenuIconButton extends Component<MenuIconButtonProps> {
  private buttonRef: RefObject<HTMLButtonElement> = createRef();
  @observable private menuOpen = false;
  private anchorEl: HTMLButtonElement;

  render() {
    const { Icon, color = 'default', children } = this.props;

    return (
      <>
        <IconButton className={cnMenuIconButton()} ref={this.buttonRef} color={color} onClick={this.toggle}>
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
