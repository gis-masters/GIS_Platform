import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const KptImportMass: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M8 16v-5h1v2h1v-2h1v2h-1v1h1v2h-1v-2H9v2zm4 0v-5h4v5h-1v-4h-2v4zm5-4v-1h3v1h-1v4h-1v-4z' />
      <path d='M19 3h-2c-.796 0-1 .215-1 1 0 .774.247 1 1 1h2v2c0 .807.204 1 1 1 .84 0 1-.15 1-1V5h2c.86 0 1-.172 1-1 0-.818-.172-1-1-1h-2V1c0-.774-.204-1-1-1-.818 0-1 .247-1 1Zm2 16H7V3h7c.86 0 1-.226 1-1 0-.807-.118-1-1-1H6c-.796 0-1 .204-1 1v18c0 .807.204 1 1 1h16c.774 0 1-.226 1-1V10c0-.807-.226-1-1-1-.85 0-1 .16-1 1ZM4 22V5c0-.785-.215-.99-1-1-.796-.011-1 .237-1 1v18c0 .763.237 1 1 1h16c.782 0 1.01-.193 1-1-.01-.774-.26-1-1-1z' />
    </SvgIcon>
  ),
  { muiName: 'KptImportMass' }
);
