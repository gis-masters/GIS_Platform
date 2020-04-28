import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { supportedGeometryTypes } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryError } from './Error/EditFeatureGeometry-Error';
import { EditFeatureGeometryHeader } from './Header/EditFeatureGeometry-Header';
import { EditFeatureGeometryModify } from './Modify/EditFeatureGeometry-Modify';
import { EditFeatureGeometryProjSel } from './ProjSel/EditFeatureGeometry-ProjSel';
import { EditFeatureGeometryForm } from './Form/EditFeatureGeometry-Form.composed';
import { EditFeatureGeometryView } from './View/EditFeatureGeometry-View.composed';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryProps {
  store: EditFeatureGeometryStore;
  readOnly: boolean;
}

export const EditFeatureGeometry = observer<FC<EditFeatureGeometryProps>>(({ store, readOnly }) => {
  if (!(store && store.geometry)) {
    return (
      <div className={cnEditFeatureGeometry()}>
        <EditFeatureGeometryError>
          Отсутствует геометрия.
        </EditFeatureGeometryError>
      </div>
    );
  }

  const { geometry } = store;
  const geometryType = supportedGeometryTypes.includes(geometry.type) ? geometry.type : undefined;

  return (
    <div className={cnEditFeatureGeometry()}>
      <EditFeatureGeometryHeader>
        {!readOnly && <EditFeatureGeometryModify store={store} />}
        <EditFeatureGeometryProjSel store={store} />
      </EditFeatureGeometryHeader>
      {!readOnly && <EditFeatureGeometryForm type={geometryType} store={store} />}
      {readOnly && <EditFeatureGeometryView type={geometryType} store={store} />}
    </div>
  );
});
