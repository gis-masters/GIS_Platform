import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LibraryAdd, LibraryAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Dataset } from '../../services/data/vectorData/vectorData.models';
import { Button } from '../Button/Button';
import { CreateDatasetDialog } from '../CreateDatasetDialog/CreateDatasetDialog';
import { PickupDatasetsList } from './List/PickupDatasets-List';
import { PickupDatasetSelected } from './Selected/PickupDatasets-Selected';

import '!style-loader!css-loader!sass-loader!./PickupDatasets.scss';

const cnPickupDatasets = cn('PickupDatasets');

export interface PickupDatasetsProps {
  onDatasetSelected(dataset: Dataset): void;
}

/**
 * @deprecated
 */
@observer
export default class PickupDatasets extends Component<PickupDatasetsProps> {
  @observable private open = false;
  @observable private creationDialogOpen = false;
  @observable private selectedDataset?: string;

  constructor(props: PickupDatasetsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnPickupDatasets()}>
        {this.selectedDataset && <PickupDatasetSelected name={this.selectedDataset} />}
        <Button className={cnPickupDatasets('Button')} color='primary' onClick={this.openDialog}>
          Выбрать набор данных
        </Button>
        <Dialog disableEscapeKeyDown fullWidth maxWidth={'md'} open={this.open} onClose={this.handleClose}>
          <DialogTitle>
            <div className={cnPickupDatasets('DialogTitle')}>
              Выбор набора данных
              <Button
                color='primary'
                startIcon={this.creationDialogOpen ? <LibraryAdd /> : <LibraryAddOutlined />}
                onClick={this.openCreateDialog}
              >
                Создать новый набор
              </Button>
            </div>
          </DialogTitle>

          <DialogContent className={cnPickupDatasets('DialogBody')}>
            <PickupDatasetsList onDatasetSelected={this.handleSelection} />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose}>Отмена</Button>
          </DialogActions>
        </Dialog>
        <CreateDatasetDialog
          open={this.creationDialogOpen}
          onClose={this.onCreationDialogClosed}
          onCreated={this.onDatasetCreated}
        />
      </div>
    );
  }

  @boundMethod
  private handleSelection(dataset: Dataset) {
    if (dataset) {
      this.setOpen(false);
      this.setDataset(dataset.title);
      this.props.onDatasetSelected(dataset);
    }
  }

  @action.bound
  private setDataset(datasetTitle: string) {
    this.selectedDataset = datasetTitle;
  }

  @action.bound
  private openDialog() {
    this.setOpen(true);
  }

  @action.bound
  private handleClose() {
    this.setOpen(false);
  }

  @action.bound
  private openCreateDialog() {
    this.creationDialogOpen = true;
  }

  @action.bound
  private onCreationDialogClosed() {
    this.creationDialogOpen = false;
  }

  @action.bound
  private onDatasetCreated() {
    this.creationDialogOpen = false;
  }

  @action
  private setOpen(open: boolean) {
    this.open = open;
  }
}
