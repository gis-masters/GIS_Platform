import React, {
  Component,
  createRef,
  type FC,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type RefObject
} from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu, type PropTypes } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton, type IconButtonProps } from '../IconButton/IconButton';

import './MenuIconButton.scss';

const cnMenuIconButton = cn('MenuIconButton');

interface MenuIconButtonProps extends Omit<IconButtonProps, 'ref'> {
  icon: ReactNode;
  color?: PropTypes.Color;
  keepMounted?: boolean;
  innerRef?: ForwardedRef<HTMLButtonElement>;
}

@observer
class MenuIconButtonComponent extends Component<MenuIconButtonProps> {
  private anchorRef: RefObject<HTMLButtonElement> = createRef();
  @observable private menuOpen = false;
  private anchorEl: HTMLButtonElement | null = null;

  constructor(props: MenuIconButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const {
      icon,
      color = 'default',
      children,
      className,
      innerRef,
      size,
      keepMounted,
      ...iconButtonProps
    } = this.props;

    return (
      <>
        <IconButton
          className={cnMenuIconButton(null, [className])}
          color={color}
          onClick={this.toggle}
          ref={innerRef}
          size={size}
          {...iconButtonProps}
        >
          <span className={cnMenuIconButton('Icon')}>{icon}</span>
          <ArrowDropDown className={cnMenuIconButton('Arrow', { up: this.menuOpen, size })} fontSize={size} />
          <span className={cnMenuIconButton('Anchor')} ref={this.anchorRef} />
        </IconButton>
        <Menu
          open={this.menuOpen}
          onClose={this.close}
          anchorEl={this.anchorEl}
          onClick={this.close}
          keepMounted={keepMounted}
          slotProps={{
            root: { className: cnMenuIconButton('MenuModalRoot') }
          }}
        >
          {Array.isArray(children) ? children : [children]}
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

export const MenuIconButton: FC<Omit<MenuIconButtonProps, 'innerRef'>> = forwardRef(
  (props, ref: ForwardedRef<HTMLButtonElement>) => <MenuIconButtonComponent innerRef={ref} {...props} />
);
