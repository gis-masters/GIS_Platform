import React, { type FC, Fragment, isValidElement, type ReactElement, type ReactNode, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { ButtonGroup, Menu, Tooltip } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Button, type ButtonProps } from '../Button/Button';

import './SplitButton.scss';

const cnSplitButton = cn('SplitButton');

function isFragment(node: ReactNode): node is ReactElement<{ children?: ReactNode }> {
  return isValidElement(node) && node.type === Fragment;
}

export interface SplitButtonProps extends Omit<ButtonProps, 'ref' | 'endIcon'> {
  menu: ReactNode;
  moreActionsTooltip?: string;
}

type SplitButtonState = {
  menuOpen: boolean;
  anchorEl: HTMLElement | null;
  toggle(): void;
  close(): void;
};

export const SplitButton: FC<SplitButtonProps> = observer(
  ({
    menu,
    moreActionsTooltip = 'Другие действия',
    children,
    className,
    variant,
    color = 'inherit',
    size,
    disabled,
    onClick,
    ...buttonProps
  }) => {
    const groupRef = useRef<HTMLDivElement>(null);

    const state = useLocalObservable<SplitButtonState>(() => ({
      menuOpen: false,
      anchorEl: null,
      toggle() {
        this.anchorEl = groupRef.current;
        this.menuOpen = !this.menuOpen;
      },
      close() {
        this.menuOpen = false;
      }
    }));

    return (
      <>
        <ButtonGroup
          ref={groupRef}
          variant={variant}
          color={color}
          size={size}
          disabled={disabled}
          className={cnSplitButton(null, [className])}
        >
          <Button
            variant={variant}
            color={color}
            disabled={disabled}
            {...buttonProps}
            className={cnSplitButton('Main')}
            onClick={onClick}
          >
            {children}
          </Button>

          <Tooltip title={moreActionsTooltip}>
            <Button
              variant={variant}
              color={color}
              disabled={disabled}
              className={cnSplitButton('Toggle')}
              onClick={state.toggle}
              aria-label={moreActionsTooltip}
            >
              <ArrowDropDown />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Menu
          open={state.menuOpen}
          onClose={state.close}
          anchorEl={state.anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClick={state.close}
        >
          {isFragment(menu) ? menu.props.children : menu}
        </Menu>
      </>
    );
  }
);
