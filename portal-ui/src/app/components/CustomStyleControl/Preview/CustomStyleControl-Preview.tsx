import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-Preview.scss';

const cnCustomStyleControlPreview = cn('CustomStyleControl', 'Preview');

interface CustomStyleControlPreviewProps {
  previewSrc: string;
}

export const CustomStyleControlPreview: FC<CustomStyleControlPreviewProps> = ({ previewSrc }) => (
  <img className={cnCustomStyleControlPreview()} src={previewSrc} alt='' />
);
