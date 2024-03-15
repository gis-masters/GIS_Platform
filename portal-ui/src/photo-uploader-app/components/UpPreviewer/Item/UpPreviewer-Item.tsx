import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { UploadedFile } from '../../../services/photoUploader.models';

import '!style-loader!css-loader!sass-loader!./UpPreviewer-Item.scss';
import '!style-loader!css-loader!sass-loader!../Image/UpPreviewer-Image.scss';
import '!style-loader!css-loader!sass-loader!../AdditionalInfo/UpPreviewer-AdditionalInfo.scss';

const cnUpPreviewer = cn('UpPreviewer');

export const UpPreviewerItem: FC<Pick<UploadedFile, 'url' | 'title'>> = ({ title, url }) => (
  <li className={cnUpPreviewer('Item')}>
    <img className={cnUpPreviewer('Image')} src={url} alt={title} />
  </li>
);
