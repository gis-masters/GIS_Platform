import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { CreateNewFolderOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

const cnCreateLibraryElementFolderButton = cn('CreateLibraryElement', 'FolderButton');

interface CreateLibraryElementFolderButtonProps {
  contentTypeId: string;
  onClick: (contentTypeId: string) => void;
}

export class CreateLibraryElementFolderButton extends Component<CreateLibraryElementFolderButtonProps> {
  render() {
    return (
      <Tooltip title='Создание нового элемента'>
        <IconButton className={cnCreateLibraryElementFolderButton()} onClick={this.clickHandler}>
          <CreateNewFolderOutlined />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler() {
    const { contentTypeId, onClick } = this.props;
    onClick(contentTypeId);
  }
}
