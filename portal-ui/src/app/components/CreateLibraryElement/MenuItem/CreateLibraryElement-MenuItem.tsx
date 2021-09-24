import React, { Component } from 'react';
import { ListItemIcon, MenuItem } from '@material-ui/core';
import { CreateNewFolderOutlined, DescriptionOutlined, SvgIconComponent } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { ContentType } from '../../../services/crg/schemaOld.models';
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
