import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Chip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Projection } from '../../../services/data/projection/projection.models';

import '!style-loader!css-loader!sass-loader!./SelectProjectionControl-Chip.scss';

const cnSelectProjectionControl = cn('SelectProjectionControl', 'Chip');

interface SelectProjectionControlChipProps {
  projection: Projection;
  onDelete(proj: Projection): void;
}

@observer
export class SelectProjectionControlChip extends Component<SelectProjectionControlChipProps> {
  render() {
    return (
      <div className={cnSelectProjectionControl()}>
        <Chip
          color='info'
          label={this.props.projection.title}
          onDelete={this.handleDelete}
          deleteIcon={<Clear fontSize='small' />}
          variant='outlined'
          size='small'
        />
      </div>
    );
  }

  @boundMethod
  private handleDelete() {
    this.props.onDelete(this.props.projection);
  }
}
