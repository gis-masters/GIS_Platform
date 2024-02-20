import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LayerIcon } from '../../../app/components/LayerIcon/LayerIcon.composed';
import { Button } from '../../../app/components/Button/Button';

import '!style-loader!css-loader!sass-loader!./UpCheckedLayer.scss';

interface UpCheckedLayerProps {
  title: string;
  geometryType: string;
  dataType: string;
  schemaName: string;
}

const cnUpCheckedLayer = cn('UpCheckedLayer');

export const UpCheckedLayer: FC<UpCheckedLayerProps> = observer(({ title, schemaName, dataType }) => (
  <div className={cnUpCheckedLayer()}>
    <LayerIcon className={cnUpCheckedLayer('Icon')} type='vector' schemaId={schemaName} />
    <div className={cnUpCheckedLayer('Wrapper')}>
      <span className={cnUpCheckedLayer('Title')}>{title}</span>
      <span className={cnUpCheckedLayer('DataType')}>{dataType}</span>
    </div>
    <Button className={cnUpCheckedLayer('Button')} size='large' variant='text'>
      &times;
    </Button>
  </div>
));
