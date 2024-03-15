import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { UploadedFile } from '../../services/photoUploader.models';
import { UpPreviewerItem } from './Item/UpPreviewer-Item';
import { UpPreviewerAdditionalCounter } from './AdditionalCounter/UpPreviewer-AdditionalCounter';

import '!style-loader!css-loader!sass-loader!./UpPreviewer.scss';
import '!style-loader!css-loader!sass-loader!./List/UpPreviewer-List.scss';

const cnUpPreviewer = cn('UpPreviewer');

interface UpPreviewerProps {
  files: UploadedFile[];
}

export const UpPreviewer: FC<UpPreviewerProps> = observer(({ files }) => {
  const filesToRender = files.length > 12 ? files.slice(0, 11) : files;

  return (
    <div className={cnUpPreviewer()}>
      <ul className={cnUpPreviewer('List')}>
        {filesToRender.map(({ title, url }, id) => (
          <UpPreviewerItem title={title} url={url} key={id} />
        ))}
        {files.length > 12 && <UpPreviewerAdditionalCounter count={files.length - 11} />}
      </ul>
    </div>
  );
});
