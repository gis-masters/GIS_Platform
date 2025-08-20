import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonBase, Tooltip } from '@mui/material';
import { IClassNameProps, withBemMod } from '@bem-react/core';

import { BreadcrumbsItemData } from '../../Breadcrumbs';
import { BreadcrumbsItemProps, cnBreadcrumbsItem } from '../Breadcrumbs-Item.base';

interface BreadcrumbsItemTypeButtonProps extends IClassNameProps {
  type: 'button';
  onClick?(itemData: BreadcrumbsItemData['payload']): void;
}

const ContainerComponent: React.FC<BreadcrumbsItemProps> = props => {
  const { title, className, style, children, payload, onClick } = props;

  const [needTooltip, setNeedTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const checkOverflow = useCallback(() => {
    const element = buttonRef.current?.firstElementChild as HTMLElement | null;
    if (!element) {
      return;
    }

    const next = element.offsetWidth < element.scrollWidth;
    // меняем стейт только при реальном изменении, чтобы исключить лишние рендеры
    setNeedTooltip(prev => (prev === next ? prev : next));
  }, []);

  const handleMouseEnter = useCallback(() => {
    checkOverflow();
  }, [checkOverflow]);

  const handleClick = useCallback(() => {
    onClick?.(payload);
  }, [onClick, payload]);

  // следим за изменениями размера/контента
  useEffect(() => {
    const element = buttonRef.current?.firstElementChild as HTMLElement | null;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resize = new ResizeObserver(() => checkOverflow());
    resize.observe(element);

    return () => resize.disconnect();
  }, [checkOverflow]);

  return (
    <Tooltip title={needTooltip ? title : ''} placement='top'>
      <ButtonBase
        ref={buttonRef}
        className={className}
        style={style}
        onMouseEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
        onClick={handleClick}
      >
        {children}
      </ButtonBase>
    </Tooltip>
  );
};

export const withTypeButton = withBemMod<BreadcrumbsItemProps, BreadcrumbsItemTypeButtonProps>(
  cnBreadcrumbsItem(),
  { type: 'button' },
  BreadcrumbsItem => props => <BreadcrumbsItem {...props} ContainerComponent={ContainerComponent} />
);
