import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable, makeObservable } from 'mobx';
import { AddCircleOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';
import { v4 as uuid } from 'uuid';
import { pluralize } from 'numeralize-ru';

import { FileInfo } from '../../services/data/files/files.models';
import {
  getFileBaseName,
  isFilePartOfCompoundMidTypeFile,
  isFilePartOfCompoundShapeTypeFile,
  isFilePartOfCompoundTabTypeFile,
  isPreviewAllowed,
  getCompoundMidTypeFiles,
  getCompoundShapeTypeFiles,
  getCompoundTabTypeFiles,
  isFilePartOfOptionalCompoundShapeTypeFile,
  isFilePartOfOptionalCompoundTabTypeFile
} from '../../services/data/files/files.util';
import { PropertySchemaFile } from '../../services/data/schema/schema.models';
import { createFile } from '../../services/data/files/files.service';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { LookupStatusType } from '../Lookup/Status/Lookup-Status';
import { currentUser } from '../../stores/CurrentUser.store';
import { environment } from '../../services/environment';
import { LookupList } from '../Lookup/List/Lookup-List';
import { LookupAdd } from '../Lookup/Add/Lookup-Add';
import { FileInput } from '../FileInput/FileInput';
import { sleep } from '../../services/util/sleep';
import { Lookup } from '../Lookup/Lookup';

import { FilesCompoundItem } from './CompoundItem/Files-CompoundItem';
import { Carousel } from '../Carousel/Carousel';
import { FilesItem } from './Item/Files-Item';
import { Toast } from '../Toast/Toast';

const cnFiles = cn('Files');

export interface FilesProps {
  value: FileInfo[];
  property: PropertySchemaFile;
  editable?: boolean;
  showPlaceAction?: boolean;
  onChange?(value: FileInfo[]): void;
}

export interface NewbieFile {
  id: string;
  file: File;
  status: LookupStatusType;
  statusText: string;
}

const defaultMaxFiles = 200;

@observer
export default class Files extends Component<FilesProps> {
  private uploadingNow: FileInfo | null = null;
  private uploadPool: FileInfo[] = [];
  @observable private newbies: NewbieFile[] = [];
  @observable private previewOpen = false;
  @observable private startingImageForPreview?: FileInfo;

  constructor(props: FilesProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { value, property, editable, showPlaceAction } = this.props;
    const { multiple } = property;
    const numerous = value.length > 1;

    const [singularFiles, compoundFiles] = this.separateCompoundFiles(value);
    const compoundFileKeys = Object.keys(compoundFiles);

    return (
      <>
        <Lookup className={cnFiles()}>
          {!!value.length && (
            <LookupList multiple={multiple} numerous={numerous} editable={editable}>
              {singularFiles.map((item, i) => {
                const newbie = this.getNewbie(item.id);

                return (
                  <FilesItem
                    item={item}
                    onDelete={this.deleteHandler}
                    onPreview={this.previewHandler}
                    key={`${item.id}_${i}`}
                    editable={editable}
                    showPlaceAction={showPlaceAction}
                    status={newbie?.status}
                    file={newbie?.file}
                    statusText={newbie?.statusText}
                    numerous={numerous}
                    multiple={multiple}
                  />
                );
              })}

              {compoundFileKeys.map(key => {
                return (
                  <FilesCompoundItem
                    key={key}
                    files={compoundFiles[key]}
                    showPlaceAction={showPlaceAction}
                    onDelete={this.deleteHandler}
                    onPreview={this.previewHandler}
                    getNewbie={this.getNewbie}
                    editable={editable}
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
  private deleteHandler(deletingItem: FileInfo[]) {
    this.delete(deletingItem);
  }

  private delete(deletingItem: FileInfo[]) {
    const { onChange, value } = this.props;
    const deletingItemsId = deletingItem.map(({ id }) => id);

    onChange(value.filter(({ id }) => !deletingItemsId.includes(id)));

    for (const id of deletingItemsId) {
      this.delNewbie(id);
      this.uploadPool = this.uploadPool.filter(({ id }) => id !== id);

      if (this.uploadingNow?.id === id) {
        this.uploadingNow = null;
        void this.upload();
      }
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
        .filter(notFalsyFilter);
    }
  }

  @boundMethod
  private addHandler(selectedFiles: FileList | null) {
    const { onChange, value } = this.props;

    const newFileItems: FileInfo[] = [];
    const max = Math.min(this.max - value.length, selectedFiles.length);
    const [, compoundFiles] = this.separateCompoundFiles(value);
    const compoundFilesDuplicates: string[] = [];
    for (let i = 0; i < max; i++) {
      const file = selectedFiles.item(i);

      if (compoundFiles[getFileBaseName(file.name)]?.some(item => item.title === file.name)) {
        compoundFilesDuplicates.push(file.name);

        continue;
      }

      const newItem: FileInfo = { id: uuid(), title: file.name, size: file.size, notLoaded: true };
      newFileItems.push(newItem);
      this.addNewbie({ id: newItem.id, status: 'new', statusText: 'Ожидает загрузки', file });
    }

    const newValue = [...value, ...newFileItems];
    onChange(newValue);
    this.uploadPool.push(...newFileItems);
    void this.upload();

    if (compoundFilesDuplicates.length) {
      Toast.warn(
        `${pluralize(compoundFilesDuplicates.length, 'Файл', 'Файлы', 'Файлы')}: ${compoundFilesDuplicates.join(
          ', '
        )} уже ${pluralize(compoundFilesDuplicates.length, 'добавлен', 'добавлены', 'добавлены')} в набор`
      );
    }
  }

  private async upload() {
    const fileInfo = this.uploadPool.shift();

    if (this.uploadingNow || !fileInfo) {
      return;
    }

    // ограничения по размеру файла, если админ - 1гб, если юзер но без данных в схеме - 10мб
    const maxSizeBites = currentUser.isAdmin ? 1_073_741_824 : this.props.property.maxSize || 10_485_760;

    if (maxSizeBites && fileInfo.size > maxSizeBites) {
      const maxSize = currentUser.isAdmin ? '1 Gb' : `${Number((maxSizeBites / 1024 ** 2).toFixed(2))} Mb`;
      this.editNewbie(fileInfo.id, {
        status: 'error',
        statusText: `Размер указанного файла превышает максимально допустимый — ${maxSize}.
                Для загрузки обратитесь к администратору — ${environment.contactsEmail}`
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

  @boundMethod
  private getNewbie(id: string): NewbieFile | undefined {
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

  @boundMethod
  private separateCompoundFiles(files: FileInfo[]): [FileInfo[], Record<string, FileInfo[]>] {
    const singularFiles: FileInfo[] = [];
    const compoundFiles: Record<string, FileInfo[]> = {};

    for (const file of files) {
      if (
        !compoundFiles[getFileBaseName(file.title)] &&
        (isFilePartOfOptionalCompoundShapeTypeFile(file) || isFilePartOfOptionalCompoundTabTypeFile(file))
      ) {
        singularFiles.push(file);
      } else if (isFilePartOfCompoundShapeTypeFile(file)) {
        this.setCompoundFiles(compoundFiles, files, file, getCompoundShapeTypeFiles);
      } else if (isFilePartOfCompoundTabTypeFile(file)) {
        this.setCompoundFiles(compoundFiles, files, file, getCompoundTabTypeFiles);
      } else if (isFilePartOfCompoundMidTypeFile(file)) {
        this.setCompoundFiles(compoundFiles, files, file, getCompoundMidTypeFiles);
      } else {
        singularFiles.push(file);
      }
    }

    return [singularFiles.filter(file => !compoundFiles[getFileBaseName(file.title)]), compoundFiles];
  }

  private setCompoundFiles(
    compoundFiles: Record<string, FileInfo[]>,
    files: FileInfo[],
    file: FileInfo,
    getFiles: (file: FileInfo, files: FileInfo[]) => FileInfo[]
  ) {
    if (!compoundFiles[getFileBaseName(file.title)]) {
      const allCompoundFiles = getFiles(file, files);

      if (allCompoundFiles.length) {
        compoundFiles[getFileBaseName(file.title)] = allCompoundFiles;
      }
    }
  }
}
