import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Chip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Projection } from '../../../services/data/projections/projections.models';

import '!style-loader!css-loader!sass-loader!./SelectFavoriteProjectionsControl-Chip.scss';

const cnSelectFavoriteProjectionsControlChip = cn('SelectFavoriteProjectionsControl', 'Chip');

interface SelectFavoriteProjectionsControlChipProps {
  projection: Projection;
  onDelete(proj: Projection): void;
}

@observer
export class SelectFavoriteProjectionsControlChip extends Component<SelectFavoriteProjectionsControlChipProps> {
  render() {
    return (
      <div className={cnSelectFavoriteProjectionsControlChip()}>
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
