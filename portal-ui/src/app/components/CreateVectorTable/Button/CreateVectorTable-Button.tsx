import React, { Component } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';

interface CreateVectorTableButtonProps {
  onClick(): void;
}

export class CreateVectorTableButton extends Component<CreateVectorTableButtonProps> {
  render() {
    return (
      <Tooltip title='Создать векторную таблицу'>
        <IconButton onClick={this.props.onClick}>
          <PlaylistAdd />
        </IconButton>
      </Tooltip>
    );
  }
}
