import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { DriveFileMoveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { CommonDiRegistry } from '../../services/di-registry';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./SelectProjectFromExplorerDialog.scss';

const cnSelectProjectFromExplorerDialog = cn('SelectProjectFromExplorerDialog');

interface SelectProjectFromExplorerDialogProps {
  open: boolean;
  title: string;
  startPath?: ExplorerItemData[] | undefined;
  subtitle?: string;
  loading?: boolean;
  project?: CrgProject;
  onClose(): void;
  onSelect?(folder: CrgProject): void;
  customTestForDisabled?(item: ExplorerItemData): boolean | undefined;
}

@observer
export class SelectProjectFromExplorerDialog extends Component<SelectProjectFromExplorerDialogProps> {
  @observable private disabled = true;
  @observable private selectedFolder?: CrgProject | undefined;

  constructor(props: SelectProjectFromExplorerDialogProps) {
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
      <Dialog open={open} onClose={onClose} className={cnSelectProjectFromExplorerDialog()} fullWidth maxWidth='md'>
        <DialogTitle>
          {title}
          {subtitle && <div className={cnSelectProjectFromExplorerDialog('Subtitle')}>{subtitle}</div>}
        </DialogTitle>
        <DialogContent className='scroll'>
          <RegistryConsumer id='common'>
            {({ Explorer }: CommonDiRegistry) => (
              <Explorer
                explorerRole='SelectProjectFromExplorer'
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
  private handleSelect(item: ExplorerItemData) {
    const { project } = this.props;
    this.setSelectedFolder();

    if (item.type === ExplorerItemType.PROJECT_FOLDER) {
      if (project?.id === item.payload.id) {
        this.setDisabled(true);
      } else {
        this.setSelectedFolder(item.payload);
        this.setDisabled(false);
      }
    } else {
      this.setSelectedFolder();
      this.setDisabled(true);
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
    const { customTestForDisabled } = this.props;
    if (item.type === ExplorerItemType.PROJECT) {
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
  private setSelectedFolder(selectedFolder?: CrgProject) {
    this.selectedFolder = selectedFolder;
  }
}
