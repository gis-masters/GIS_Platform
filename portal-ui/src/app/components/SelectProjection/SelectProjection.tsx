import React, { type FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type SpatialReferenceSystem } from '../../../server-types/common-contracts';
import { type Projection, projectionXTableCols } from '../../services/data/projections/projections.models';
import { getProjections, registerProjectionArrayInProj4 } from '../../services/data/projections/projections.service';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { projectionsStore } from '../../stores/Projections.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { Toast } from '../Toast/Toast';

const cnSelectProjection = cn('SelectProjection');

const selectAnother = 'Выбрать другую';

interface SelectProjectionProps extends IClassNameProps {
  label?: string;
  labelInField?: boolean;
  fullWidth?: boolean;
  value?: Projection;
  htmlId?: string;
  onChange(projection: Projection): void;
}

type SelectProjectionState = {
  dialogOpen: boolean;
  additionalProjections: Projection[];
  readonly projections: Projection[];
  openDialog(): void;
  closeDialog(): void;
  addProjection(projection: Projection): void;
};

function getRowId(srs: SpatialReferenceSystem) {
  return `${srs.authName}${srs.authSrid}`;
}

export const SelectProjection: FC<SelectProjectionProps> = observer(
  ({
    labelInField,
    fullWidth,
    className,
    value,
    htmlId = 'projectionSelect',
    label = 'Система координат',
    onChange
  }) => {
    const state = useLocalObservable<SelectProjectionState>(() => ({
      dialogOpen: false,
      additionalProjections: [
        {
          title: selectAnother,
          authSrid: 0,
          authName: selectAnother,
          auth_srid: 0,
          srtext: '',
          auth_name: '',
          proj4Text: ''
        }
      ],

      get projections() {
        return [...projectionsStore.favoriteProjections, ...this.additionalProjections];
      },

      openDialog() {
        this.dialogOpen = true;
      },

      closeDialog() {
        this.dialogOpen = false;
      },

      addProjection(projection) {
        const isExist = this.projections.some(({ title }) => title === projection.title);
        if (!isExist) {
          this.additionalProjections.unshift(projection);
        }
      }
    }));

    const handleChange = useCallback(
      (e: SelectChangeEvent) => {
        if (e.target.value.startsWith(selectAnother)) {
          state.openDialog();
        } else {
          const projection = state.projections.find(projection => e.target.value === getProjectionCode(projection));

          if (projection) {
            onChange(projection);
          } else {
            Toast.error('Не найдена выбранная система координат ' + e.target.value);
          }
        }
      },
      [onChange, state]
    );

    const handleAdditionalProjectionSelect = useCallback(
      (items: Projection[]) => {
        const selectedProjection = items[0];
        registerProjectionArrayInProj4([selectedProjection]);
        state.addProjection(selectedProjection);
        onChange(selectedProjection);
        state.closeDialog();
      },
      [onChange, state]
    );

    useEffect(() => {
      if (value) {
        state.addProjection(value);
      }
    }, [value, state]);

    return (
      <div className={cnSelectProjection(null, [className])}>
        {labelInField && (
          <InputLabel shrink id={htmlId + 'label'}>
            {label}
          </InputLabel>
        )}
        <Select
          className={cnSelectProjection('Select')}
          id={htmlId}
          size='small'
          autoWidth
          labelId={htmlId + 'label'}
          fullWidth={fullWidth}
          value={(value && getProjectionCode(value)) || ''}
          variant='standard'
          onChange={handleChange}
        >
          {!value && <MenuItem value='' />}

          {state.projections.map(item => {
            const crs = getProjectionCode(item);

            return (
              <MenuItem value={crs} key={crs}>
                {item.title}
              </MenuItem>
            );
          })}
        </Select>

        <ChooseXTableDialog<Projection>
          getData={getProjections}
          selectedItems={[...projectionsStore.favoriteProjections, ...state.additionalProjections]}
          title={'Выбор системы координат'}
          open={state.dialogOpen}
          cols={projectionXTableCols}
          getRowId={getRowId}
          onClose={state.closeDialog}
          onSelect={handleAdditionalProjectionSelect}
          withoutSelectAll
          single
        />
      </div>
    );
  }
);
