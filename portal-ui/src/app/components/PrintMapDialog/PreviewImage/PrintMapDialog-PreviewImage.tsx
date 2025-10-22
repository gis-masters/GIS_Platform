import React, { type FC, type RefObject } from 'react';
import { cn } from '@bem-react/classname';

import './PrintMapDialog-PreviewImage.scss';

const cnPrintMapDialogPreviewImage = cn('PrintMapDialog', 'PreviewImage');

interface PrintMapDialogPreviewImageProps {
  src: string;
  imgRef: RefObject<HTMLImageElement>;
}

export const PrintMapDialogPreviewImage: FC<PrintMapDialogPreviewImageProps> = ({ src, imgRef }) => (
  <img className={cnPrintMapDialogPreviewImage()} src={src} ref={imgRef} draggable={false} alt='' />
);
