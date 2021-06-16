import React, { FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PrintDialog-PreviewImage.scss';

const cnPrintDialogPreviewImage = cn('PrintDialog', 'PreviewImage');

interface PrintDialogPreviewImageProps {
  src: string;
  imgRef: RefObject<HTMLImageElement>;
}

export const PrintDialogPreviewImage: FC<PrintDialogPreviewImageProps> = ({ src, imgRef }) => (
  <img className={cnPrintDialogPreviewImage()} src={src} ref={imgRef} draggable={false} alt='' />
);
