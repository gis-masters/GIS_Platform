import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type UploadedFile } from '../../../services/photoUploader.models';

import './UpPreviewer-Item.scss';
import '../Image/UpPreviewer-Image.scss';
import '../AdditionalInfo/UpPreviewer-AdditionalInfo.scss';

const cnUpPreviewer = cn('UpPreviewer');

export const UpPreviewerItem: FC<Pick<UploadedFile, 'url' | 'title'>> = ({ title, url }) => (
  <li className={cnUpPreviewer('Item')}>
    <img className={cnUpPreviewer('Image')} src={url} alt={title} />
  </li>
);
