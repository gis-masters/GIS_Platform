import React, { Component } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { viewedProjections } from '../../services/geoserver/projections.service';
import { cnFormControl } from '../Form/Control/Form-Control';
import { FormField } from '../Form/Field/Form-Field';
import { FormLabel } from '../Form/Label/Form-Label';

const cnSelectProjection = cn('SelectProjection');

interface SelectProjectionProps extends IClassNameProps {
  value: string;
  onChange(name: string): void;
}

export class SelectProjection extends Component<SelectProjectionProps> {
  render() {
    const { value, className } = this.props;

    return (
      <FormField className={cnSelectProjection(null, [className])}>
        <FormLabel htmlFor='projSelector'>Система координат</FormLabel>
        <div className={cnFormControl()}>
          <Select
            className={cnSelectProjection('Selector')}
            value={value}
            variant='standard'
            onChange={this.handleChange}
          >
            {viewedProjections.map((projection, key) => (
              <MenuItem value={projection.id} key={key}>
                {projection.title}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FormField>
    );
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent) {
    this.props.onChange(e.target.value);
  }
}
