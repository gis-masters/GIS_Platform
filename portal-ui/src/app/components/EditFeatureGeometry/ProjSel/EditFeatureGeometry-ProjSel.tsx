import React, { FC, useCallback, ChangeEvent } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import {
  viewedProjections,
  getProjection,
  replaceHiddenProjectionId
} from '../../../services/geoserver/projections.service';
import { FormField, FormLabel, FormControl } from '../../Form/Form';
import { Select } from '../../Select/Select';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-ProjSel.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface Props {
  store: EditFeatureGeometryStore;
}

export const EditFeatureGeometryProjSel: FC<Props> = observer(({ store }: Props) => {
  const handleChange = useCallback(
    (e: ChangeEvent<{ name?: string; value: unknown }>) => {
      store.setProjection(getProjection(e.target.value as string));
    },
    [store]
  );

  return (
    <FormField className={cnEditFeatureGeometry('ProjSel')}>
      <FormLabel htmlFor='projSel'>Система координат</FormLabel>
      <FormControl>
        <Select
          options={viewedProjections.map(proj => ({ value: proj.id, children: proj.title }))}
          onChange={handleChange}
          value={replaceHiddenProjectionId(store.currentProjection.id)}
        />
      </FormControl>
    </FormField>
  );
});
