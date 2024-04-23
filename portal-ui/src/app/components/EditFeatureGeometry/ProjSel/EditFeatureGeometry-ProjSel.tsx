import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { getProjection, replaceHiddenProjectionId } from '../../../services/geoserver/projections.service';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { SelectProjection } from '../../SelectProjection/SelectProjection';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ProjSel.scss';

const cnEditFeatureGeometryProjSel = cn('EditFeatureGeometry', 'ProjSel');

interface Props {
  store: EditFeatureGeometryStore;
}

export const EditFeatureGeometryProjSel: FC<Props> = observer(({ store }: Props) => {
  const handleChange = useCallback(
    (name: string) => {
      store.setProjection(getProjection(name));
    },
    [store]
  );

  return (
    <SelectProjection
      className={cnEditFeatureGeometryProjSel()}
      value={replaceHiddenProjectionId(store.currentProjection.id)}
      onChange={handleChange}
    />
  );
});
