import React, { FC } from 'react';
import { observer } from 'mobx-react';

import { UpLoadItem } from '../UpLoadItem/UpLoadItem';
import { UpLoadHandlerActions } from './Actions/UpLoadHandler-Actions';
import { UploadedFile } from '../../services/photoUploader.models';

export const UpLoadHandler: FC<{ item: UploadedFile }> = observer(({ item }) => (
  <UpLoadItem item={item} actions={<UpLoadHandlerActions status={item.status} />} />
));
