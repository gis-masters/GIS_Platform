import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { DriveFileMoveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { LibraryRecord } from '../../services/data/library/library.models';
import { CommonDiRegistry } from '../../services/di-registry';
import { isRecordUpdateAllowed } from '../../services/permissions/permissions.service';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./SelectFolderDialog.scss';

const cnSelectFolderDialog = cn('SelectFolderDialog');

interface SelectFolderDialogProps {
  open: boolean;
  title: string;
  startPath?: ExplorerItemData[] | undefined;
  subtitle?: string;
  loading?: boolean;
  document?: LibraryRecord;
  onClose(): void;
  onSelect?(folder: LibraryRecord): void;
  customTestForDisabled?(item: ExplorerItemData): boolean | undefined;
}

@observer
export class SelectFolderDialog extends Component<SelectFolderDialogProps> {
  @observable private disabled = true;
  @observable private selectedFolder?: LibraryRecord | undefined;

  constructor(props: SelectFolderDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const selectButton = (
      <Button
        children='Выбрать'
        onClick={this.submitFolderSelection}
        color='primary'
        startIcon={<DriveFileMoveOutlined />}
        loading={this.props.loading}
        disabled={this.disabled}
      />
    );
    const { title, subtitle, open, startPath, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} className={cnSelectFolderDialog()} fullWidth maxWidth='md'>
        <DialogTitle>
          {title}
          {subtitle && <div className={cnSelectFolderDialog('Subtitle')}>{subtitle}</div>}
        </DialogTitle>
        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ Explorer }: CommonDiRegistry) => (
              <Explorer
                explorerRole='SelectFolder'
                path={startPath}
                onSelect={this.handleSelect}
                disabledTester={this.testForDisabled}
                hideToolbarActions
                customFilters={{
                  [ExplorerItemType.LIBRARY]: { is_folder: { $in: [true] } }
                }}
              />
            )}
          </RegistryConsumer>
        </DialogContent>
        <DialogActions>
          <ActionsRight>
            {this.disabled ? (
              <Tooltip title={this.selectedFolder ? 'Недостаточно прав' : 'Не выбрана папка'}>
                <span>{selectButton}</span>
              </Tooltip>
            ) : (
              selectButton
            )}
            <Button onClick={onClose}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async handleSelect(item: ExplorerItemData) {
    const { document } = this.props;
    this.setSelectedFolder();

    if (item.type === ExplorerItemType.FOLDER) {
      if (document?.id === item.payload.id) {
        this.setDisabled(true);
      } else {
        this.setSelectedFolder(item.payload);
      }
    } else {
      this.setSelectedFolder();
      this.setDisabled(true);
    }

    if (this.selectedFolder?.is_folder) {
      this.setDisabled(!(await isRecordUpdateAllowed(this.selectedFolder)));
    }
  }

  @boundMethod
  private submitFolderSelection() {
    if (this.selectedFolder && this.props.onSelect) {
      this.props.onSelect(this.selectedFolder);
    }
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    const { customTestForDisabled, document } = this.props;
    if (item.type === ExplorerItemType.FOLDER) {
      return document?.id === item.payload.id;
    }

    if (item.type === ExplorerItemType.DOCUMENT) {
      return true;
    }

    if (customTestForDisabled) {
      return customTestForDisabled(item) || false;
    }

    return false;
  }

  @action.bound
  private setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  @action.bound
  private setSelectedFolder(selectedFolder?: LibraryRecord) {
    this.selectedFolder = selectedFolder;
  }
}
