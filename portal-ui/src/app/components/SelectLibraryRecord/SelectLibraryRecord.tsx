import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { DocumentLibrary, LibraryRecord } from '../../services/crg/doc-library.service';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { schemaService } from '../../services/crg/schema.service';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Datasource } from '../AddLayerDialog/AddLayerDialog';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Explorer } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectLibraryRecord.scss';

const cnSelectLibraryRecord = cn('SelectLibraryRecord');

interface SelectDataTableProps extends FormControlProps {
  usedLibraryRecords: LibraryRecord[];
}

@observer
export class SelectLibraryRecord extends Component<SelectDataTableProps> {
  @observable private dialogOpen = false;
  @observable private selectedLibraryRecord?: LibraryRecord;
  @observable private selectedLibrary?: DocumentLibrary;

  render() {
    const { className, htmlId, fieldValue = {} } = this.props;
    const { libraryRecord } = fieldValue as LibraryRecord;

    return (
      <>
        <ButtonBase
          focusRipple
          className={cnSelectLibraryRecord({ empty: !libraryRecord }, [className])}
          id={htmlId}
          onClick={this.openDialog}
        >
          {libraryRecord ? <Breadcrumbs items={this.breadcrumbsItems} itemsType='none' /> : 'Не выбрано'}
        </ButtonBase>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog} maxWidth='md'>
          <DialogTitle>Выберите источник данных</DialogTitle>
          <DialogContent>
            <Explorer
              id='SelectLibraryRecord'
              className={cnSelectLibraryRecord('Explorer')}
              preset={ExplorerItemType.LIBRARY_ROOT}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              disabledTester={this.testForDisabled}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' disabled={!this.selectedLibraryRecord} onClick={this.submitDialog}>
              Выбрать
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get breadcrumbsItems(): BreadcrumbsItemData[] {
    const { fieldValue = {} } = this.props;

    if (fieldValue) {
      const { libraryRecord, library } = fieldValue as Datasource;

      return [
        { title: library.title, subtitle: library.identifier },
        { title: libraryRecord.title, subtitle: libraryRecord.id }
      ];
    }
  }

  @boundMethod
  private async handleSelect(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.DOCUMENT && !(await this.testForDisabled(item))) {
      this.select(path[path.length - 1].payload as LibraryRecord, path[1].payload as DocumentLibrary);
    } else {
      this.select(null, null);
    }
  }

  @action
  private select(libraryRecord: LibraryRecord, library: DocumentLibrary) {
    this.selectedLibraryRecord = libraryRecord;
    this.selectedLibrary = library;
  }

  @boundMethod
  private async handleOpen(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.DOCUMENT) {
      await this.handleSelect(item, path);
      this.submitDialog();
    }
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private submitDialog() {
    const { property } = this.props;

    this.closeDialog();
    this.props.onChange({
      value: { libraryRecord: this.selectedLibraryRecord, library: this.selectedLibrary },
      propertyName: property.name
    });

    this.selectedLibraryRecord = null;
    this.selectedLibrary = null;
  }

  @boundMethod
  private async testForDisabled(item: ExplorerItemData<LibraryRecord>): Promise<boolean> {
    if (item.type === ExplorerItemType.DOCUMENT) {
      const libraryRecord = item.payload;

      if (libraryRecord.type !== 'tif') {
        return true;
      }

      if (!libraryRecord.schemaId) {
        return true;
      }

      try {
        const schema = await schemaService.getOldSchema(libraryRecord.schemaId);
        if (!schema) {
          return true;
        }
      } catch {
        return true;
      }

      return this.props.usedLibraryRecords.some(
        ({ libraryId, id }) => libraryRecord.libraryId === libraryId && libraryRecord.id === id
      );
    }

    return false;
  }
}
