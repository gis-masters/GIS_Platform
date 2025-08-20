import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const LibraryAdd: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M13.682 17.005v2.528h3.792v3.792h2.528v-3.792h3.793v-2.528h-3.793v-3.793h-2.528v3.793z' />
      <path d='M9.085 9.962c-2.36-2.2-5.52-3.55-9-3.55v11c3.48 0 6.64 1.35 9 3.55a13.396 13.396 0 0 1 3.103-2.154l.011-.006.002-3.185c0-.1-.002-.116-.002-.116 1.489 0 2.88-.004 3.762 0 .056 0 .038 0 .039-.056.003-1.102 0-2.52 0-3.744l2.085-.002V6.413c-3.48 0-6.64 1.35-9 3.55zm0-3.55c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z' />
    </SvgIcon>
  ),
  { muiName: 'LibraryAdd' }
);
