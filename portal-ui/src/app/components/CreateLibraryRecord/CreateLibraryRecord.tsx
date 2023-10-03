import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { CreateNewFolderOutlined, NoteAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { schemaService } from '../../services/data/schema/schema.service';
import { ContentType, Schema } from '../../services/data/schema/schema.models';
import { Library, LibraryRecord } from '../../services/data/library/library.models';

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
  @observable private schema: Schema;
  private fetchingSchemaOperationId: symbol;

  constructor(props: CreateLibraryRecordProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();
  }

  async componentDidUpdate(prevProps: CreateLibraryRecordProps) {
    if (prevProps.library.schemaId !== this.props.library.schemaId) {
      await this.fetchSchema();
    }
  }

  render() {
    const { library, parent, onCreate } = this.props;

    return (
      <div className={cnCreateLibraryRecord()}>
        {this.schema && (
          <>
            {this.contentTypesWithoutFolder.length === 1 && (
              <CreateLibraryRecordItem
                contentType={this.contentTypesWithoutFolder[0]}
                schema={this.schema}
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
                schema={this.schema}
                library={library}
                parent={parent}
                onCreate={onCreate}
              />
            )}

            {this.folderContentTypes.length === 1 && (
              <CreateLibraryRecordItem
                contentType={this.folderContentTypes[0]}
                schema={this.schema}
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
                schema={this.schema}
                onCreate={onCreate}
              />
            )}
          </>
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
    const parentContentType = this.schema?.contentTypes?.find(({ id }) => id === parent?.content_type_id);

    return (
      this.schema?.contentTypes?.filter(
        ({ childOnly, id }) =>
          !childOnly ||
          parentContentType?.children?.some(childInfo => {
            return childInfo.contentType === id && (!childInfo.library || childInfo.library === library.table_name);
          })
      ) || []
    );
  }

  private async fetchSchema() {
    const { library } = this.props;
    const operationId = Symbol();
    this.fetchingSchemaOperationId = operationId;

    const schema = await schemaService.getSchema(library.schemaId);

    if (operationId === this.fetchingSchemaOperationId) {
      this.setSchema(schema);
    }
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}
