import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { supportedGeometryTypes } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryModify } from './Modify/EditFeatureGeometry-Modify';
import { EditFeatureGeometryProjSel } from './ProjSel/EditFeatureGeometry-ProjSel';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';
import '!style-loader!css-loader!sass-loader!./Error/EditFeatureGeometry-Error.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
}

export const EditFeatureGeometry = observer<FC<EditFeatureGeometryProps>>(({ store }) => {
  if (!(store && store.geometry)) {
    return (
      <div className={cnEditFeatureGeometry()}>
        <div className={cnEditFeatureGeometry('Error')}>
          Отсутствует геометрия.
        </div>
      </div>
    );
  }

  const { geometry } = store;
  const geometryType = supportedGeometryTypes.includes(geometry.type) ? geometry.type : undefined;

  return (
    <div className={cnEditFeatureGeometry()}>
      <EditFeatureGeometryHeader>
        <EditFeatureGeometryModify store={store} />
        <EditFeatureGeometryProjSel store={store} />
      </EditFeatureGeometryHeader>
      <EditFeatureGeometryForm type={geometryType} store={store} />
    </div>
  );
});
