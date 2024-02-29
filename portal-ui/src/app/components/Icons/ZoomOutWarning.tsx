import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const ZoomOutWarning: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 20 20'>
      <path d='M12.23 15.9c1.118-1.312 2.051-2.392 2.073-2.399.034-.011 4.11 4.856 4.078 4.87-.051.021-8.19-.035-8.187-.057.002-.015.918-1.102 2.035-2.414zM14.22 1.589h4.124L16.386 3.9a315.645 315.645 0 01-2.054 2.411l-.096.1-2.014-2.332a347.242 347.242 0 01-2.07-2.411c-.056-.076.097-.079 4.067-.079zM5.388 19.71H1.825v-1.692h2.717v-2.734H3.119v-1.736h1.423v-2.691H1.825V9.121h2.717V6.387H3.119V4.74l.64-.012.762-.012.023-2.756H1.826V.268h7.126V1.96H6.235v2.777h1.423v1.649H6.235V9.12h2.717v1.736H6.235v2.691h1.423v1.736H6.235v2.734h2.717v1.692z' />
    </SvgIcon>
  ),
  { muiName: 'ZoomOutWarning' }
);
