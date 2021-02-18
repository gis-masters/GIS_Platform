import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, computed, observable } from 'mobx';
import { ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown, CreateNewFolderOutlined, DescriptionOutlined, NoteAddOutlined } from '@material-ui/icons';

import { Button } from '../../Button/Button';
import { DocHome } from '../../Icons/DocHome';
import { ContentType } from '../../../services/crg/schema.models';
import { ExplorerItemType } from '../../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./../FolderButton/CreateLibraryElement-FolderButton.scss';

const cnCreateLibraryElement = cn('CreateLibraryElement');

const allowedIcons = {
  FOLDER: CreateNewFolderOutlined,
  DOCUMENT: DescriptionOutlined,
  GPZU: DocHome
};

export interface CreateLibraryElementProps {
  contentTypes: ContentType[];
  onClick: (id: string) => void;
}

@observer
export class CreateLibraryElementButton extends Component<CreateLibraryElementProps> {
  @observable private anchorEl: HTMLElement | null = null;

  render() {
    return (
      <>
        <Button
          color='primary'
          onClick={this.toggleOpen}
          startIcon={<NoteAddOutlined />}
          endIcon={<KeyboardArrowDown />}
        />
        <Menu open={Boolean(this.anchorEl)} onClose={this.close} anchorEl={this.anchorEl}>
          {this.contentTypesWithoutFolder.map(cType => {
            const Icon = allowedIcons[cType.icon] || DescriptionOutlined;

            return (
              <MenuItem key={cType.id} onClick={() => this.clickHandler(cType.id)}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                {cType.title ? cType.title : 'Файл'}
              </MenuItem>
            );
          })}
        </Menu>

        {this.folderContentType && (
          <Button
            className={cnCreateLibraryElement('FolderButton')}
            color='primary'
            onClick={() => this.clickHandler(this.folderContentType.id)}
            startIcon={<CreateNewFolderOutlined />}
          />
        )}
      </>
    );
  }

  @boundMethod
  private clickHandler(contentTypeId: string) {
    this.close();
    this.props.onClick(contentTypeId);
  }

  @action.bound
  private close() {
    this.anchorEl = null;
  }

  @action.bound
  private toggleOpen(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.anchorEl = this.anchorEl ? null : (e.target as HTMLElement);
  }

  @computed
  private get contentTypesWithoutFolder(): ContentType[] {
    return this.props.contentTypes.filter(cType => cType.type !== ExplorerItemType.FOLDER.toUpperCase());
  }

  @computed
  private get folderContentType(): ContentType {
    return this.props.contentTypes.find(cType => cType.type === ExplorerItemType.FOLDER.toUpperCase());
  }
}
