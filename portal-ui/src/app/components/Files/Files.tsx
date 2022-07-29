import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { AddCircleOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';
import { v4 as uuid } from 'uuid';

import { PropertySchemaFile } from '../../services/crg/schema.models';
import { createFile, FileInfo } from '../../services/files.service';
import { LookupStatusType } from '../Lookup/Status/Lookup-Status';
import { currentUser } from '../../stores/CurrentUser.store';
import { isPreviewAllowed } from '../../services/files.util';
import { LookupList } from '../Lookup/List/Lookup-List';
import { LookupAdd } from '../Lookup/Add/Lookup-Add';
import { FileInput } from '../FileInput/FileInput';
import { sleep } from '../../services/util/sleep';
import { env } from '../../stores/Env.store';
import { Lookup } from '../Lookup/Lookup';

import { FilesItem } from './Item/Files-Item';
import { Carousel } from '../Carousel/Carousel';

const cnFiles = cn('Files');

interface FilesProps {
  value: FileInfo[];
  property: PropertySchemaFile;
  editable?: boolean;
  onChange?(value: FileInfo[]): void;
}

interface NewbieFile {
  id: string;
  file: File;
  status: LookupStatusType;
  statusText: string;
}

const defaultMaxFiles = 200;

@observer
export class Files extends Component<FilesProps> {
  private uploadingNow: FileInfo | null = null;
  private uploadPool: FileInfo[] = [];
  @observable private newbies: NewbieFile[] = [];
  @observable private previewOpen = false;
  @observable private startingImageForPreview: FileInfo;
  @observable private deletingItem: FileInfo;

  render() {
    const { value, property, editable } = this.props;
    const { multiple } = property;
    const numerous = value.length > 1;

    return (
      <>
        <Lookup className={cnFiles()}>
          {!!value.length && (
            <LookupList multiple={multiple} numerous={numerous} editable={editable}>
              {value.map((item, i) => {
                const newbie = this.getNewbie(item.id);

                return (
                  <FilesItem
                    item={item}
                    onDelete={this.deleteHandler}
                    onPreview={this.previewHandler}
                    key={`${item.id}_${i}`}
                    editable={editable}
                    status={newbie?.status}
                    file={newbie?.file}
                    statusText={newbie?.statusText}
                    numerous={numerous}
                    multiple={multiple}
                  />
                );
              })}
            </LookupList>
          )}
          {editable && value.length < this.max && (
            <LookupAdd filled={Boolean(value.length)}>
              <FileInput
                multiple={multiple}
                onChange={this.addHandler}
                nameHidden={Boolean(value.length)}
                buttonCaption={value.length ? 'Добавить' : 'Выбрать'}
                autoClear
                iconButton={!value.length}
                buttonProps={{ variant: 'text', startIcon: <AddCircleOutline />, color: 'primary' }}
              />
            </LookupAdd>
          )}
        </Lookup>

        {this.previewOpen && (
          <Carousel
            open={this.previewOpen}
            onClose={this.onPreviewClose}
            allImages={this.allImages}
            startingImageForPreview={this.startingImageForPreview}
          />
        )}
      </>
    );
  }

  @computed
  private get max(): number {
    const { multiple, maxFiles } = this.props.property;

    return multiple ? maxFiles || defaultMaxFiles : 1;
  }

  @boundMethod
  private deleteHandler(deletingItem: FileInfo) {
    this.delete(deletingItem);
  }

  private delete(deletingItem: FileInfo) {
    const { onChange, value } = this.props;
    onChange(value.filter(({ id }) => id !== deletingItem.id));
    this.delNewbie(deletingItem.id);
    this.uploadPool = this.uploadPool.filter(({ id }) => id !== deletingItem.id);

    if (this.uploadingNow?.id === deletingItem.id) {
      this.uploadingNow = null;
      void this.upload();
    }
  }

  @action.bound
  private previewHandler(item: FileInfo) {
    this.previewOpen = true;
    this.startingImageForPreview = item;
  }

  @action.bound
  private onPreviewClose() {
    this.previewOpen = false;
  }

  @computed
  private get allImages(): FileInfo[] {
    const { value } = this.props;
    if (value.length) {
      return value
        .map(item => {
          if (isPreviewAllowed(item)) {
            return item;
          }
        })
        .filter(item => item);
    }
  }

  @boundMethod
  private addHandler(selectedFiles: FileList | null) {
    const { onChange, value } = this.props;

    const newFileItems: FileInfo[] = [];
    const max = Math.min(this.max - value.length, selectedFiles.length);

    for (let i = 0; i < max; i++) {
      const file = selectedFiles.item(i);
      const newItem: FileInfo = { id: uuid(), title: file.name, size: file.size, notLoaded: true };
      newFileItems.push(newItem);
      this.addNewbie({ id: newItem.id, status: 'new', statusText: 'Ожидает загрузки', file });
    }

    const newValue = [...value, ...newFileItems];
    onChange(newValue);
    this.uploadPool.push(...newFileItems);
    void this.upload();
  }

  private async upload() {
    if (this.uploadingNow || !this.uploadPool.length) {
      return;
    }

    const fileInfo = this.uploadPool.shift();
    // ограничения по размеру файла, если админ - 1гб, если юзер но без данных в схеме - 10мб
    const maxSizeBites = currentUser.isAdmin ? 1_073_741_824 : this.props.property.maxSize || 10_485_760;

    if (maxSizeBites && fileInfo.size > maxSizeBites) {
      const maxSize = currentUser.isAdmin ? '1 Gb' : `${Number((maxSizeBites / Math.pow(1024, 2)).toFixed(2))} Mb`;
      this.editNewbie(fileInfo.id, {
        status: 'error',
        statusText: `Размер указанного файла превышает максимально допустимый — ${maxSize}.
                Для загрузки обратитесь к администратору — ${env.contactsEmail}`
      });

      if (this.uploadPool.length) {
        void this.upload();
      }

      return;
    }

    this.uploadingNow = fileInfo;
    this.editNewbie(fileInfo.id, { status: 'loading', statusText: 'Загружается' });

    try {
      const newFileInfo = await createFile(this.getNewbie(fileInfo.id).file);
      this.updateItem(fileInfo.id, { id: newFileInfo.id, notLoaded: false });
      this.editNewbie(fileInfo.id, { id: newFileInfo.id });
      void this.showSuccess(newFileInfo.id);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      this.editNewbie(fileInfo.id, {
        status: 'error',
        statusText: err?.response?.data?.message || err.message || 'Ошибка загрузки'
      });
    }

    this.uploadingNow = null;
    if (this.uploadPool.length) {
      void this.upload();
    }
  }

  private async showSuccess(id: string) {
    this.editNewbie(id, { status: 'success', statusText: 'Загрузка успешно завершена' });
    await sleep(2000);
    this.editNewbie(id, { status: 'successFadeOut' });
    await sleep(1000);
    this.editNewbie(id, { status: 'normal' });
  }

  private updateItem(id: string, patch: Partial<FileInfo>) {
    const { value } = this.props;
    const itemIndex = value.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      // пользователь успел уже удалить файл
      this.delNewbie(id);

      return;
    }

    const newItem = { ...value[itemIndex], ...patch };
    if (!newItem.notLoaded) {
      delete newItem.notLoaded;
    }
    const newValue = [...value];
    newValue.splice(itemIndex, 1, newItem);
    this.props.onChange(newValue);
  }

  @action
  private addNewbie(newbie: NewbieFile) {
    this.newbies.push(newbie);
  }

  private getNewbie(id: string): NewbieFile {
    return this.newbies.find(newbie => newbie.id === id);
  }

  @action
  private editNewbie(newbieId: string, { id, status, file, statusText: error }: Partial<NewbieFile>) {
    const newbie = this.getNewbie(newbieId);

    if (newbie) {
      if (id) {
        newbie.id = id;
      }
      if (status) {
        newbie.status = status;
      }
      if (file) {
        newbie.file = file;
      }
      if (error) {
        newbie.statusText = error;
      }
    }
  }

  @action
  private delNewbie(id: string) {
    const index = this.newbies.findIndex(newbie => newbie.id === id);
    if (index !== -1) {
      this.newbies.splice(index, 1);
    }
  }
}
