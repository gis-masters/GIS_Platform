import React, { type FC, type PropsWithChildren } from 'react';
import { Tooltip } from '@mui/material';

interface OptionalTooltipProps extends PropsWithChildren {
  title?: string;
}

export const OptionalTooltip: FC<OptionalTooltipProps> = ({ title, children }) =>
  title ? (
    <Tooltip title={title}>
      <span>{children}</span>
    </Tooltip>
  ) : (
    <>{children}</>
  );
