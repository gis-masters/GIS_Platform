import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CompoundMainFiles, FileInfo } from '../../../services/data/files/files.models';
import {
  getFileBaseName,
  getFileExtension,
  getMissingCompoundFileTypes,
  normalizeExtension
} from '../../../services/data/files/files.util';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { NewbieFile } from '../Files.async';
import { FilesItem } from '../Item/Files-Item';

import '!style-loader!css-loader!sass-loader!./Files-CompoundItem.scss';

const cnFilesCompoundItem = cn('Files', 'CompoundItem');

interface FilesCompoundItemProps {
  files: FileInfo[];
  propertyName?: string;
  editable?: boolean;
  showPlaceAction?: boolean;
  document?: LibraryRecord;
  onDelete(item: FileInfo[]): void;
  onPreview(item: FileInfo): void;
  getNewbie(id: string): NewbieFile | undefined;
}

@observer
export class FilesCompoundItem extends Component<FilesCompoundItemProps> {
  render() {
    const { files, editable, showPlaceAction, document, propertyName, onDelete, onPreview, getNewbie } = this.props;

    return (
      <div className={cnFilesCompoundItem()}>
        {this.compoundFiles.map((item, i) => {
          const newbie = getNewbie(item.id);

          return (
            <FilesItem
              item={item}
              onDelete={getMissingCompoundFileTypes(files).length ? onDelete : this.handleDelete}
              onPreview={onPreview}
              showMainCompoundFileActions={!getMissingCompoundFileTypes(files).length && !i}
              key={`${item.id}_${i}`}
              editable={!getMissingCompoundFileTypes(files).length && i !== 0 ? false : editable}
              status={newbie?.status}
              file={newbie?.file}
              showPlaceAction={showPlaceAction}
              statusText={newbie?.statusText}
              document={document}
              propertyName={propertyName}
              numerous
              multiple
            />
          );
        })}

        {this.missingCompoundFiles?.map((item, i) => {
          return (
            <FilesItem
              item={item}
              onDelete={onDelete}
              onPreview={onPreview}
              key={`${item.id}_${i}`}
              editable={false}
              status={'notAvailable'}
              file={undefined}
              statusText={undefined}
              document={document}
              propertyName={propertyName}
              numerous
              multiple
            />
          );
        })}
      </div>
    );
  }

  @computed
  private get compoundFiles(): FileInfo[] {
    const { files } = this.props;

    const compoundMainFilesValues = Object.values(CompoundMainFiles);

    if (files.length > 1) {
      const compoundFiles: FileInfo | undefined = files.find(({ title }) =>
        compoundMainFilesValues.includes(normalizeExtension(getFileExtension(title)) as CompoundMainFiles)
      );

      if (compoundFiles) {
        const index = files.indexOf(compoundFiles, 0);

        files.unshift(...files.splice(index, 1));
      }
    }

    return files;
  }

  @computed
  private get missingCompoundFiles(): FileInfo[] | undefined {
    const missingFiles = getMissingCompoundFileTypes(this.props.files);

    if (missingFiles.length) {
      return missingFiles.map((type, i) => {
        return {
          id: String(i),
          title: `${getFileBaseName(this.props.files[0].title)}.${type}`,
          size: 0
        };
      });
    }
  }

  @boundMethod
  private handleDelete() {
    const { files, onDelete } = this.props;

    onDelete(files);
  }
}
