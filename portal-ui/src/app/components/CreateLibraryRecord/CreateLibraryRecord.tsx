import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { CreateNewFolderOutlined, NoteAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Library, LibraryRecord } from '../../services/data/library/library.models';
import { ContentType } from '../../services/data/schema/schema.models';
import { CreateLibraryRecordButton } from './Button/CreateLibraryRecord-Button';
import { CreateLibraryRecordItem } from './Item/CreateLibraryRecord-Item.composed';

import '!style-loader!css-loader!sass-loader!./CreateLibraryRecord.scss';

const cnCreateLibraryRecord = cn('CreateLibraryRecord');

interface CreateLibraryRecordProps {
  library: Library;
  parent?: LibraryRecord;
  onCreate(record: LibraryRecord, isFolder: boolean): void;
}

@observer
export class CreateLibraryRecord extends Component<CreateLibraryRecordProps> {
  constructor(props: CreateLibraryRecordProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { library, parent, onCreate } = this.props;

    return (
      <div className={cnCreateLibraryRecord()}>
        {this.contentTypesWithoutFolder.length === 1 && (
          <CreateLibraryRecordItem
            contentType={this.contentTypesWithoutFolder[0]}
            library={library}
            parent={parent}
            onCreate={onCreate}
            single
          />
        )}

        {this.contentTypesWithoutFolder.length > 1 && (
          <CreateLibraryRecordButton
            contentTypes={this.contentTypesWithoutFolder}
            icon={<NoteAddOutlined />}
            library={library}
            parent={parent}
            onCreate={onCreate}
          />
        )}

        {this.folderContentTypes.length === 1 && (
          <CreateLibraryRecordItem
            contentType={this.folderContentTypes[0]}
            library={library}
            parent={parent}
            onCreate={onCreate}
            single
          />
        )}

        {this.folderContentTypes.length > 1 && (
          <CreateLibraryRecordButton
            contentTypes={this.folderContentTypes}
            icon={<CreateNewFolderOutlined />}
            library={library}
            parent={parent}
            onCreate={onCreate}
          />
        )}
      </div>
    );
  }

  @computed
  private get contentTypesWithoutFolder(): ContentType[] {
    return this.availableContentTypes.filter(({ type }) => type !== 'FOLDER');
  }

  @computed
  private get folderContentTypes(): ContentType[] {
    return this.availableContentTypes.filter(({ type }) => type === 'FOLDER');
  }

  @computed
  private get availableContentTypes(): ContentType[] {
    const { parent, library } = this.props;
    const parentContentType = library.schema.contentTypes?.find(({ id }) => id === parent?.content_type_id);

    return (
      library.schema.contentTypes?.filter(
        ({ childOnly, id }) =>
          !childOnly ||
          parentContentType?.children?.some(childInfo => {
            return childInfo.contentType === id && (!childInfo.library || childInfo.library === library.table_name);
          })
      ) || []
    );
  }
}
