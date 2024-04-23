import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Chip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { EpsgModelModified } from '../../../services/data/epsg/epsg.models';

import '!style-loader!css-loader!sass-loader!./SelectEPSGControl-Chip.scss';

const cnSelectEPSGControl = cn('SelectEPSGControl', 'Chip');

interface SelectEPSGControlChipProps {
  epsg: EpsgModelModified;
  onDelete(epsg: EpsgModelModified): void;
}

@observer
export class SelectEPSGControlChip extends Component<SelectEPSGControlChipProps> {
  render() {
    return (
      <div className={cnSelectEPSGControl()}>
        <Chip
          color='info'
          label={this.props.epsg.title}
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
    this.props.onDelete(this.props.epsg);
  }
}
