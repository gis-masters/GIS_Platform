import React, { Component } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import { DriveFileMoveOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';

import { isRecordUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { LibraryRecord } from '../../services/data/library/library.models';
import { CommonDiRegistry } from '../../services/di-registry';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectFolderDialog.scss';

const cnSelectFolderDialog = cn('SelectFolderDialog');

interface SelectFolderDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  startPath?: ExplorerItemData[] | undefined;
  subtitle?: string;
  loading?: boolean;
  document?: LibraryRecord;
  customTestForDisabled?: (item: ExplorerItemData<LibraryRecord>) => boolean | undefined;
  onSelect?: (folder: LibraryRecord) => void;
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
      <Dialog open={open} onClose={onClose} className={cnSelectFolderDialog()}>
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
    if (item.type !== ExplorerItemType.FOLDER) {
      this.setSelectedFolder();
      this.setDisabled(true);
    }

    this.setSelectedFolder((item as ExplorerItemData<LibraryRecord>).payload);

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
  private async testForDisabled(item: ExplorerItemData<LibraryRecord>): Promise<boolean> {
    const { customTestForDisabled } = this.props;

    if (item.type === ExplorerItemType.FOLDER) {
      const allowed = await isRecordUpdateAllowed(item.payload);

      return !allowed;
    }

    if (item.type === ExplorerItemType.DOCUMENT) {
      return true;
    }

    if (customTestForDisabled) {
      return customTestForDisabled(item) || false;
    }
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
