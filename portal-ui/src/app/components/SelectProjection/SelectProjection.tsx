import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { SpatialReferenceSystem } from '../../../server-types/common-contracts';
import { Projection, projectionXTableCols } from '../../services/data/projections/projections.models';
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

@observer
export class SelectProjection extends Component<SelectProjectionProps> {
  @observable private dialogOpen = false;
  @observable private additionalProjections: Projection[] = [
    {
      title: selectAnother,
      authSrid: 0,
      authName: selectAnother,
      auth_srid: 0,
      srtext: '',
      auth_name: '',
      proj4Text: ''
    }
  ];

  constructor(props: SelectProjectionProps) {
    super(props);
    makeObservable(this);

    if (props.value) {
      this.addProjection(props.value);
    }
  }

  componentDidUpdate(prevProps: SelectProjectionProps): void {
    const { value } = this.props;
    if (value && prevProps.value !== value) {
      this.addProjection(value);
    }
  }

  render() {
    const {
      labelInField,
      fullWidth,
      className,
      value,
      htmlId = 'projectionSelect',
      label = 'Система координат'
    } = this.props;

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
          onChange={this.handleChange}
        >
          {!value && <MenuItem value='' />}

          {this.projections.map(item => {
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
          selectedItems={[...projectionsStore.favoriteProjections, ...this.additionalProjections]}
          title={'Выбор системы координат'}
          open={this.dialogOpen}
          cols={projectionXTableCols}
          getRowId={this.getRowId}
          onClose={this.closeDialog}
          onSelect={this.handleAdditionalProjectionSelect}
          withoutSelectAll
          single
        />
      </div>
    );
  }

  @computed private get projections(): Projection[] {
    return [...projectionsStore.favoriteProjections, ...this.additionalProjections];
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent) {
    if (e.target.value.startsWith(selectAnother)) {
      this.openDialog();
    } else {
      const projection = this.projections.find(projection => e.target.value === getProjectionCode(projection));

      if (projection) {
        this.props.onChange(projection);
      } else {
        Toast.error('Не найдена выбранная система координат ' + e.target.value);
      }
    }
  }

  @action.bound
  private handleAdditionalProjectionSelect(items: Projection[]) {
    const { onChange } = this.props;
    const selectedProjection = items[0];
    registerProjectionArrayInProj4([selectedProjection]);
    this.addProjection(selectedProjection);
    onChange?.(selectedProjection);
    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private addProjection(projection: Projection) {
    const isExist = this.projections.some(({ title }) => title === projection.title);
    if (!isExist) {
      this.additionalProjections.unshift(projection);
    }
  }

  private getRowId(srs: SpatialReferenceSystem) {
    return srs.authName + String(srs.authSrid);
  }
}
