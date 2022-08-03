import React, { Component } from 'react';
import { ListItemIcon, MenuItem } from '@mui/material';
import { CreateNewFolderOutlined, DescriptionOutlined, SvgIconComponent } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { ContentType } from '../../../services/data/schema.models';
import { DocHome } from '../../Icons/DocHome';

const cnCreateLibraryElementMenuItem = cn('CreateLibraryElement', 'MenuItem');

const icons: Record<string, SvgIconComponent> = {
  FOLDER: CreateNewFolderOutlined,
  DOCUMENT: DescriptionOutlined,
  GPZU: DocHome
};

interface CreateLibraryElementMenuItemProps {
  contentType: ContentType;
  onClick: (contentTypeId: string) => void;
}

export class CreateLibraryElementMenuItem extends Component<CreateLibraryElementMenuItemProps> {
  render() {
    const { contentType } = this.props;
    const Icon = icons[contentType.icon] || DescriptionOutlined;

    return (
      <MenuItem onClick={this.handleClick} className={cnCreateLibraryElementMenuItem()}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        {contentType.title || 'Файл'}
      </MenuItem>
    );
  }

  @boundMethod
  private handleClick() {
    const { onClick, contentType } = this.props;
    onClick(contentType.id);
  }
}
