import React, { Component } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';

interface CreateDatasetElementButtonProps {
  onClick: () => void;
}

export class CreateDatasetElementButton extends Component<CreateDatasetElementButtonProps> {
  render() {
    return (
      <Tooltip title='Создать набор данных'>
        <IconButton onClick={this.props.onClick}>
          <PlaylistAdd />
        </IconButton>
      </Tooltip>
    );
  }
}
