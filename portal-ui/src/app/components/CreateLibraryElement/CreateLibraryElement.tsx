import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';
import { schemaService } from '../../services/crg/schema.service';
import { ContentType, FeatureDescription } from '../../services/crg/schema.models';
import { getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { docLibraryService, DocumentLibrary } from '../../services/crg/doc-library.service';

import { CreateLibraryElementButton } from './Button/CreateLibraryElement-Button';
import { CreateLibraryElementDialog } from './Dialog/CreateLibraryElement-Dialog';

export interface CreateLibraryElementsProps {
  library: DocumentLibrary;
}

@observer
export class CreateLibraryElement extends Component<CreateLibraryElementsProps> {
  @observable private open = false;
  @observable private schema: FeatureDescription;
  @observable private contentTypes: ContentType[] = [];

  private contentTypeId: string;

  async componentDidMount() {
    const schema = await schemaService.getSchema(this.props.library.schemaId);
    this.setSchema(schema);
  }

  render() {
    return (
      <>
        {this.schema && (
          <CreateLibraryElementButton contentTypes={this.schema.contentTypes} onClick={this.clickHandler} />
        )}

        <CreateLibraryElementDialog
          schema={this.schema}
          open={this.open}
          onClose={this.closeDialog}
          onCreate={this.createHandler}
        />
      </>
    );
  }

  @boundMethod
  private clickHandler(contentTypeId: string) {
    const preparedSchema = getSchemaWithAppliedContentType(this.schema, contentTypeId);
    this.setSchema(preparedSchema);
    this.contentTypeId = contentTypeId;
    this.openDialog();
  }

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private closeDialog() {
    this.open = false;
  }

  @action
  private setSchema(schema: FeatureDescription) {
    this.schema = schema;
  }

  @action.bound
  private async createHandler(formValue: { [key: string]: unknown }) {
    for (const propName in formValue) {
      if (!formValue[propName]) {
        delete formValue[propName];
      }
    }

    formValue.content_type_id = this.contentTypeId;

    try {
      const crgDocuments = await docLibraryService.createRecord(this.schema.tableName, formValue);
      if (crgDocuments) {
        services.logger.info('Send event to refresh explorer');
      }
    } catch (e) {
      services.logger.error('Error saving library item: ', e);
    } finally {
      this.closeDialog();
    }
  }
}
