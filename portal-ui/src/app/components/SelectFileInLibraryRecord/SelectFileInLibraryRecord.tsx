import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { isTifFile } from '../../services/data/files/files.util';
import { FileInfo } from '../../services/data/files/files.models';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { DocumentLibrary, LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Datasource } from '../AddLayerDialog/AddLayerDialog';
import { Explorer } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectFileInLibraryRecord.scss';

const cnSelectFileInLibraryRecord = cn('SelectFileInLibraryRecord');

@observer
export class SelectFileInLibraryRecord extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private selectedLibraryRecord?: LibraryRecord;
  @observable private selectedLibrary?: DocumentLibrary;
  @observable private selectedFile?: FileInfo;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, htmlId, fieldValue = {} } = this.props;
    const { libraryRecord } = fieldValue as LibraryRecord;

    return (
      <>
        <ButtonBase
          focusRipple
          className={cnSelectFileInLibraryRecord({ empty: !libraryRecord }, [className])}
          id={htmlId}
          onClick={this.openDialog}
        >
          {libraryRecord ? <Breadcrumbs items={this.breadcrumbsItems} itemsType='none' /> : 'Не выбрано'}
        </ButtonBase>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog} maxWidth='md'>
          <DialogTitle>Выберите источник данных</DialogTitle>
          <DialogContent>
            <Explorer
              explorerRole='SelectLibraryRecord'
              className={cnSelectFileInLibraryRecord('Explorer')}
              preset={ExplorerItemType.LIBRARY_ROOT}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              disabledTester={this.testForDisabled}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' disabled={this.disabledSelect} onClick={this.submitDialog}>
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
      const { libraryRecord, library, file } = fieldValue as Datasource;

      return [
        { title: library.title, subtitle: library.table_name },
        { title: libraryRecord.title, subtitle: libraryRecord.id },
        { title: file.title, subtitle: file.id }
      ];
    }
  }

  @boundMethod
  private handleSelect(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.FILE && !this.testForDisabled(item)) {
      this.select(
        path.at(-1).payload as FileInfo,
        path.at(-2).payload as LibraryRecord,
        path[1].payload as DocumentLibrary
      );
    } else {
      this.select(null, null, null);
    }
  }

  @action
  private select(file: FileInfo, libraryRecord: LibraryRecord, library: DocumentLibrary) {
    this.selectedLibraryRecord = libraryRecord;
    this.selectedLibrary = library;
    this.selectedFile = file;
  }

  @boundMethod
  private handleOpen(item: ExplorerItemData<LibraryRecord>, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.FILE) {
      this.handleSelect(item, path);
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
      value: { libraryRecord: this.selectedLibraryRecord, library: this.selectedLibrary, file: this.selectedFile },
      propertyName: property.name
    });

    this.selectedLibraryRecord = null;
    this.selectedLibrary = null;
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    if (item.type === ExplorerItemType.FILE) {
      return !isTifFile(item.payload as FileInfo);
    }

    return false;
  }

  private get disabledSelect(): boolean {
    if (this.selectedFile) {
      return !isTifFile(this.selectedFile);
    }

    return true;
  }
}
