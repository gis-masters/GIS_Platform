import React, { type FC } from 'react';
import { ContentCopy } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import './BboxPreview-CopyButton.scss';

const cnBboxPreview = cn('BboxPreview');

interface BboxPreviewCopyButtonProps {
  onClick(): void;
}

export const BboxPreviewCopyButton: FC<BboxPreviewCopyButtonProps> = ({ onClick }) => (
  <IconButton onClick={onClick} size='small' className={cnBboxPreview('CopyButton')}>
    <ContentCopy fontSize='small' />
  </IconButton>
);
