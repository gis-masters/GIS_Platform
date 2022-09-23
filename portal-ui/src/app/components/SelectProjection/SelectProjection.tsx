import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { FormField } from '../Form/Field/Form-Field';
import { FormLabel } from '../Form/Label/Form-Label';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { viewedProjections } from '../../services/geoserver/projections.service';

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
        <FormControl>
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
        </FormControl>
      </FormField>
    );
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent) {
    this.props.onChange(e.target.value);
  }
}
