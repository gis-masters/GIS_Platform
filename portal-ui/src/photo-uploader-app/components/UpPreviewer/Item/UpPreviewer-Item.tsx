import React, { FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./UpPreviewer-Item.scss';
import '!style-loader!css-loader!sass-loader!../Image/UpPreviewer-Image.scss';
import '!style-loader!css-loader!sass-loader!../AdditionalInfo/UpPreviewer-AdditionalInfo.scss';

export interface UploadedFile {
  title: string;
  size: number;
  url: string;
}

const cnUpPreviewer = cn('UpPreviewer');

export const UpPreviewerItem: FC<UploadedFile> = ({ title, url }) => {
  const loadHandler = useCallback(() => {
    URL.revokeObjectURL(url);
  }, [url]);

  return (
    <li className={cnUpPreviewer('Item')}>
      <img className={cnUpPreviewer('Image')} src={url} alt={title} onLoad={loadHandler} />
    </li>
  );
};
