import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { Button } from '../../../app/components/Button/Button';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';
import { UpSelectedLayer } from '../UpSelectedLayer/UpSelectedLayer';
import { UpLoadResultContent } from './Content/UpLoadResult-Content';
import { UpConnectionsToProjects } from '../UpConnectionsToProjects/UpConnectionsToProjects';

import '!style-loader!css-loader!sass-loader!./UpLoadResult.scss';
import '!style-loader!css-loader!sass-loader!./Button/UpLoadResult-Button.scss';

const cnUpLoadResult = cn('UpLoadResult');

const loadMore = () => {
  photoUploaderStore.files.forEach(item => URL.revokeObjectURL(item.url));
  photoUploaderStore.clearUploadedFiles();
  photoUploaderStore.returnToMainScreen();
  photoUploaderStore.clearUploadResult();
};

export const UpLoadResult: FC = observer(() => (
  <div className={cnUpLoadResult()}>
    <UpSelectedLayer atResultsScreen />
    {!!photoUploaderStore.uploadResult && (
      <>
        <UpConnectionsToProjects />
        <UpLoadResultContent />
      </>
    )}
    <Button className={cnUpLoadResult('Button')} onClick={loadMore}>
      Загрузить еще
    </Button>
  </div>
));
