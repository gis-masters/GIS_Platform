import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeTabPoint: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M12 2C6.49 2 2 6.49 2 12c0 1.377.28 2.691.787 3.887.3.692.634 1.288 1.002 1.818.074.106.142.198.211.295v-.009c.159.212.325.416.498.612v-3.9a9.55 9.55 0 0 1-.226-.745A7.99 7.99 0 0 1 4 12.06C4 7.65 7.59 4 12 4s8 3.59 8 8c.009.45-.046.98-.145 1.5h2.03c.075-.506.115-1.02.115-1.5 0-5.51-4.49-10-10-10zm0 7c-1.66 0-3 1.34-3 3 .021.58.15 1.036.397 1.5h5.206c.256-.46.394-1.043.397-1.5 0-1.66-1.34-3-3-3z' />
      <path d='M7.5 22.5v-6H6V15h4.5v1.5H9v6zm3-.013v-5L12.465 15H16.5v7.487H15V20h-3v2.487m3-3.987v-2h-1.978L12 17.987v.513m6 3.988V15h3.494c.471 0 1 .643 1 1.114v.945c0 .5-.25.75-.5 1l-.25.25-.25.25.25.25.25.25c.25.25.5.5.5 1v1.428c0 .471-.529 1-1 1zm3.2-1.288v-1.898h-1.96V21.2zm-.206-3.398v-1.3H19.24v1.3z' />
    </SvgIcon>
  ),
  { muiName: 'TypeTabPoint' }
);
