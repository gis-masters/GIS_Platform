import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton } from '@material-ui/core';
import { CreateNewFolderOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

const cnCreateLibraryElementFolderButton = cn('CreateLibraryElement', 'FolderButton');

interface CreateLibraryElementFolderButtonProps {
  contentTypeId: string;
  onClick: (contentTypeId: string) => void;
}

export class CreateLibraryElementFolderButton extends Component<CreateLibraryElementFolderButtonProps> {
  render() {
    return (
      <IconButton className={cnCreateLibraryElementFolderButton()} onClick={this.clickHandler}>
        <CreateNewFolderOutlined />
      </IconButton>
    );
  }

  @boundMethod
  private clickHandler() {
    const { contentTypeId, onClick } = this.props;
    onClick(contentTypeId);
  }
}
