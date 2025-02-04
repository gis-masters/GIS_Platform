import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { TableView } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Library } from '../../services/data/library/library.models';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { getLibraryFolderExplorerUrl, getRegistryUrlWithPath } from '../DataManagement/DataManagement.utils';
import { IconButton } from '../IconButton/IconButton';
import { ExplorerView } from '../Icons/ExplorerView';

const cnLibraryViewSwitch = cn('LibraryViewSwitch');

interface LibraryViewSwitchProps {
  to: 'registry' | 'explorer';
  library: Library;
  path: number[];
}

@observer
export class LibraryViewSwitch extends Component<LibraryViewSwitchProps> {
  private operationId?: symbol;
  @observable private currentFolderTitle?: string;

  constructor(props: LibraryViewSwitchProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchCurrentFolderTitle();
  }

  async componentDidUpdate(prevProps: LibraryViewSwitchProps) {
    if (this.props.path.at(-1) !== prevProps.path.at(-1)) {
      await this.fetchCurrentFolderTitle();
    }
  }

  render() {
    const { to, library, path } = this.props;
    const title = this.currentFolderTitle ? `раздела "${this.currentFolderTitle}"` : `библиотеки "${library.title}"`;
    const tip = `Перейти к ${to === 'explorer' ? 'иерархическому' : 'табличному'} виду ${title}`;
    const [Icon, href] =
      to === 'explorer'
        ? [ExplorerView, getLibraryFolderExplorerUrl(library.table_name, path)]
        : [TableView, getRegistryUrlWithPath(library.table_name, path)];

    return (
      <Tooltip title={tip}>
        <IconButton className={cnLibraryViewSwitch()} href={href}>
          <Icon />
        </IconButton>
      </Tooltip>
    );
  }

  private async fetchCurrentFolderTitle() {
    const { path, library } = this.props;
    const lastPathItem = path.at(-1);
    if (!lastPathItem) {
      this.setCurrentFolderTitle(undefined);

      return;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const { title } = await getLibraryRecord(library.table_name, lastPathItem);

    if (operationId === this.operationId) {
      this.setCurrentFolderTitle(title);
    }
  }

  @action
  private setCurrentFolderTitle(title?: string) {
    this.currentFolderTitle = title;
  }
}
