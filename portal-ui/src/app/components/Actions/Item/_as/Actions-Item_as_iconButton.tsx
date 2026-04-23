import React, { type FC, useEffect } from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { IconButton } from '../../../IconButton/IconButton';
import { MenuIconButton } from '../../../MenuIconButton/MenuIconButton';
import { type ActionsItemProps, cnActionsItem } from '../Actions-Item.base';

const TOOLTIP_ENTER_MS = 600;

type ActionsItemIconTooltipState = {
  tooltipOpen: boolean;
  enterTimerId: ReturnType<typeof setTimeout> | null;
  clearEnterTimer(): void;
  hideTooltip(): void;
  scheduleShowTooltip(): void;
};

function scheduleDeferredTooltipOpen(state: ActionsItemIconTooltipState, delayMs: number) {
  return setTimeout(() => {
    runInAction(() => {
      state.tooltipOpen = true;
    });
  }, delayMs);
}

const ActionsItemAsIconButton: FC<ActionsItemProps> = observer(
  ({ title, tooltipText, className, disabled, color, url, icon, download, onClick, submenu, loading, size }) => {
    const state = useLocalObservable<ActionsItemIconTooltipState>(() => ({
      tooltipOpen: false,
      enterTimerId: null,

      clearEnterTimer() {
        if (this.enterTimerId !== null) {
          clearTimeout(this.enterTimerId);
          this.enterTimerId = null;
        }
      },

      hideTooltip() {
        this.clearEnterTimer();
        this.tooltipOpen = false;
      },

      scheduleShowTooltip() {
        this.clearEnterTimer();
        this.enterTimerId = scheduleDeferredTooltipOpen(this, TOOLTIP_ENTER_MS);
      }
    }));

    useEffect(
      () => () => {
        state.clearEnterTimer();
      },
      [state]
    );

    return (
      <Tooltip title={tooltipText || title} disableInteractive open={state.tooltipOpen} onClose={state.hideTooltip}>
        <span onPointerEnter={state.scheduleShowTooltip} onPointerLeave={state.hideTooltip}>
          {submenu ? (
            <MenuIconButton className={className} icon={icon} onMenuOpenChange={state.hideTooltip}>
              {submenu}
            </MenuIconButton>
          ) : (
            <IconButton
              className={cnActionsItem(null, [className])}
              disabled={disabled}
              onClick={onClick}
              color={color}
              href={url}
              download={download}
              loading={loading}
              size={size}
              onPointerDown={state.hideTooltip}
            >
              {icon}
            </IconButton>
          )}
        </span>
      </Tooltip>
    );
  }
);

export const asIconButton = withBemMod<ActionsItemProps, ActionsItemProps>(
  cnActionsItem(),
  { as: 'iconButton' },
  () => ActionsItemAsIconButton
);
