import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { FileInfo } from '../../services/data/files/files.models';
import { isZipFile } from '../../services/data/files/files.util';
import { kptMassUploadSchema } from '../../services/data/kpt/kpt.models';
import { uploadKpt } from '../../services/data/kpt/kpt.service';
import { Library, LibraryRecord } from '../../services/data/library/library.models';
import { Role } from '../../services/permissions/permissions.models';
import { checkIsUpdateAllowed } from '../../services/permissions/permissions.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { IconButton } from '../IconButton/IconButton';
import { KptImportMass } from '../Icons/KptImportMass';
import { LibraryMassKptLoadUploader } from './Uploader/LibraryMassKptLoad-Uploader';
import { LibraryMassKptLoadWorker } from './Worker/LibraryMassKptLoad-Worker';

export interface UploadFileInfo {
  file: File;
  status: 'success' | 'error' | null;
  fileInfo: FileInfo | null;
}

interface LibraryMassKptLoadProps {
  library?: Library;
  parent?: LibraryRecord;
  libraryRecord?: LibraryRecord;
  role?: Role;
  disabled?: boolean;
  tooltipTitle?: string;
}

const titleWithPermissions = 'Массовая загрузка КПТ из zip-архивов';
const titleWithoutPermissions = 'У вас недостаточно прав для создания документов в данной папке';

const cnLibraryMassKptLoad = cn('LibraryMassKptLoad');

@observer
export class LibraryMassKptLoad extends Component<LibraryMassKptLoadProps> {
  @observable private busy: boolean = false;
  @observable private formDialogOpen: boolean = false;
  @observable private files: UploadFileInfo[] = [];
  @observable private ableUpload: boolean = true;
  @observable count: number = 0;
  @observable private progress: number = 0;

  constructor(props: LibraryMassKptLoadProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { library, libraryRecord, parent, role, disabled, tooltipTitle } = this.props;
    const updateAllowed = role ? checkIsUpdateAllowed(role) : false;

    const isData = !!role && !!library && !!libraryRecord && !!parent;

    return (
      <>
        <Tooltip title={tooltipTitle || updateAllowed ? titleWithPermissions : titleWithoutPermissions}>
          <span>
            <IconButton
              className={cnLibraryMassKptLoad()}
              onClick={this.openFormDialog}
              disabled={disabled || !updateAllowed}
            >
              <KptImportMass />
            </IconButton>
          </span>
        </Tooltip>

        {isData && (
          <>
            <FormDialog
              className={cnLibraryMassKptLoad()}
              open={!this.busy && this.formDialogOpen}
              onClose={this.closeFormDialog}
              title={titleWithPermissions}
              schema={kptMassUploadSchema}
              actionFunction={this.handleLoad}
              actionButtonProps={{ children: 'Загрузка' }}
              afterForm={<LibraryMassKptLoadWorker onChange={this.handleChangeFiles} />}
            />

            <LibraryMassKptLoadUploader
              isOpen={this.busy}
              count={this.count}
              handledCount={this.uploadHandledCount}
              successCount={this.successUploadedCount}
              failedCount={this.failUploadedCount}
              progress={this.progress}
              onStopLoading={this.stopLoading}
            />
          </>
        )}
      </>
    );
  }

  @computed
  get uploadHandledCount(): number {
    return this.files.filter(file => file.status).length;
  }

  @computed
  get successUploadedCount(): number {
    return this.files.filter(file => file.status === 'success').length;
  }

  @computed
  get failUploadedCount(): number {
    return this.files.filter(file => file.status === 'error').length;
  }

  @action.bound
  private async handleLoad(data: LibraryRecord): Promise<void> {
    const { parent, library } = this.props;

    if (!library) {
      throw new Error('Ошибка: библиотека не определена');
    }

    if (!this.files.length) {
      return;
    }
    this.setBusy(true);

    for (const file of this.files) {
      if (!this.ableUpload) {
        break;
      }

      if (file.status) {
        continue;
      }

      data.path = parent?.path ? `${parent.path}/${parent.id}` : '/root';

      const { status } = await uploadKpt({
        data,
        file,
        libraryTableName: library.table_name,
        properties: kptMassUploadSchema.properties
      });
      file.status = status;

      const processedFilesCount = this.files.filter(file => file.status).length;

      this.setProgress((processedFilesCount / this.files.length) * 100);
    }

    this.setBusy(false);
  }

  @action
  private setProgress(progress: number): void {
    this.progress = progress;
  }

  @action
  private setFiles(files: UploadFileInfo[]): void {
    this.files = files;
  }

  @action
  private setBusy(busy: boolean): void {
    this.busy = busy;
  }

  @action.bound
  private stopLoading(): void {
    this.ableUpload = true;
    this.busy = false;
  }

  @action.bound
  private openFormDialog(): void {
    this.formDialogOpen = true;
  }

  @action.bound
  private closeFormDialog(): void {
    this.formDialogOpen = false;
  }

  @action.bound
  private handleChangeFiles(incomeFiles: FileList): void {
    const filesForUpload = [...incomeFiles].filter(isZipFile).map(file => ({ file, fileInfo: null, status: null }));

    this.setFiles(filesForUpload);
    this.count = filesForUpload.length;
  }
}
