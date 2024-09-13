import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import { OptionalTooltip } from '../../../../components/OptionalTooltip/OptionalTooltip';
import { Button } from '../../../Button/Button';
import { MenuButton } from '../../../MenuButton/MenuButton';
import { ActionsItemProps, cnActionsItem } from '../Actions-Item.base';

const ActionsItemAsButton: FC<ActionsItemProps> = ({
  title,
  tooltipText,
  icon,
  className,
  disabled,
  color,
  url,
  download,
  submenu,
  loading,
  onClick
}) => {
  return submenu ? (
    <MenuButton
      className={cnActionsItem(null, [className])}
      href={download ? url : undefined}
      routerLink={download ? undefined : url}
      onClick={onClick}
      color={color || 'inherit'}
      startIcon={icon}
      disabled={disabled}
      loading={loading}
      menu={submenu}
    >
      {title}
    </MenuButton>
  ) : (
    <OptionalTooltip title={tooltipText}>
      <Button
        className={cnActionsItem(null, [className])}
        href={download ? url : undefined}
        routerLink={download ? undefined : url}
        disabled={disabled}
        onClick={onClick}
        color={color || 'inherit'}
        startIcon={icon}
      >
        {title}
      </Button>
    </OptionalTooltip>
  );
};

export const asButton = withBemMod<ActionsItemProps, ActionsItemProps>(
  cnActionsItem(),
  { as: 'button' },
  () => ActionsItemAsButton
);
