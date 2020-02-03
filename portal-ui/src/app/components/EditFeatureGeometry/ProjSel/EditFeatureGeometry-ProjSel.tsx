import * as React from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { Select } from '../../Select/Select';
import { projections } from '../../../services/geoserver/projections-transform.service';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ProjSel.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface Props {
  store: EditFeatureGeometryStore;
}

export const EditFeatureGeometryProjSel: React.FC<Props> = observer(({ store }: Props) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    store.setProjection(projections.find(projection => projection.id === e.target.value as string));
  }, [store]);

  return (
    <div className={cnEditFeatureGeometry('ProjSel')}>
      <Select
        options={projections.map(proj => ({ value: proj.id, children: proj.title }))}
        label={'Система координат'}
        onChange={handleChange}
        value={store.currentProjection.id}
      />
    </div>
  );
});
