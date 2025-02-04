import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const DeletedDocuments: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 64 64'>
      <g>
        <path d='M28 7c-2.757 0-5 2.243-5 5v3H13a2 2 0 0 0 0 4h2.11l1.683 30.332A6.003 6.003 0 0 0 22.783 55h18.434a6.004 6.004 0 0 0 5.99-5.668L48.891 19H51a2 2 0 0 0 0-4H41v-3c0-2.757-2.243-5-5-5h-8zm0 4h8c.552 0 1 .449 1 1v3H27v-3c0-.551.448-1 1-1zm-8.887 8h25.774l-1.674 30.11A2 2 0 0 1 41.217 51H22.783a2 2 0 0 1-1.996-1.889L19.113 19zM32 23.25A1.75 1.75 0 0 0 30.25 25v20a1.75 1.75 0 1 0 3.5 0V25A1.75 1.75 0 0 0 32 23.25zm-7.357.002a1.75 1.75 0 0 0-1.688 1.809l.697 20.085a1.75 1.75 0 0 0 1.748 1.69h.063a1.751 1.751 0 0 0 1.687-1.81l-.697-20.087a1.76 1.76 0 0 0-1.81-1.687zm14.712 0a1.753 1.753 0 0 0-1.808 1.687l-.697 20.086a1.75 1.75 0 0 0 1.687 1.81c.021.002.042 0 .063 0a1.75 1.75 0 0 0 1.748-1.689l.697-20.085a1.75 1.75 0 0 0-1.69-1.809z' />
      </g>
    </SvgIcon>
  ),
  { muiName: 'DeletedDocuments' }
);
