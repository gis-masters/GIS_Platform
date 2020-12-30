import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AssignmentOutlined, Delete, DeleteOutline } from '@material-ui/icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { EditedField } from '../../../services/crg/schema.service';
import { documentsService } from '../../../services/crg/documents.service';
import { getBaseUrl } from '../../../services/server-urls.service';
import { DocumentListItemData } from '../../EditFeatureField/Control/_type/EditFeatureField-Control_type_lookup';
import { EditFeatureInfo } from '../../EditFeatureField/EditFeatureField';
import { Button } from '../../Button/Button';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./DocumentsList-Item.scss';
import '!style-loader!css-loader!sass-loader!../Icon/DocumentList-Icon.scss';
import '!style-loader!css-loader!sass-loader!../Content/DocumentList-Content.scss';
import '!style-loader!css-loader!sass-loader!../DeleteButton/DocumentList-DeleteButton.scss';

const cnDocumentsList = cn('DocumentsList');

interface DocumentItemProps {
  document: DocumentListItemData;
  editedField: EditedField;
  featureInfo: EditFeatureInfo;

  deleteCallback(id: string);
}

@observer
export class DocumentsListItem extends Component<DocumentItemProps> {
  @observable private isDeleteDocumentDialogOpen = false;
  @observable private url = '';

  async componentDidMount() {
    const baseUrl = await getBaseUrl();
    const { id } = this.props.document;
    const { resourcePath } = this.props.editedField.property;

    this.setUrl(`${baseUrl}${resourcePath}/records/${id}/download`);
  }

  render() {
    const { document, featureInfo } = this.props;

    return (
      <>
        <div className={cnDocumentsList('Item')}>
          <AssignmentOutlined className={cnDocumentsList('Icon')} color='action' fontSize='small' />

          <Link className={cnDocumentsList('Content')} url={this.url} download={document.title}>
            {document.title}
          </Link>

          {featureInfo.isReadOnly ? (
            <IconButton className={cnDocumentsList('DeleteButton')} onClick={this.openDeleteDialog} size='small'>
              {this.isDeleteDocumentDialogOpen ? (
                <Delete color='action' fontSize='small' />
              ) : (
                <DeleteOutline color='action' fontSize='small' />
              )}
            </IconButton>
          ) : null}
        </div>

        <Dialog open={this.isDeleteDocumentDialogOpen}>
          <DialogContent>
            <DialogContentText>
              Вы действительно хотите удалить файл?
              <br />
              {this.props.document.title}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteDocument} color='primary' variant='outlined'>
              Да
            </Button>
            <Button onClick={this.closeDeleteDialog} variant='outlined'>
              Нет
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action.bound
  private openDeleteDialog() {
    this.isDeleteDocumentDialogOpen = true;
  }

  @action.bound
  private closeDeleteDialog() {
    this.isDeleteDocumentDialogOpen = false;
  }

  @boundMethod
  private async deleteDocument() {
    const { id } = this.props.document;
    const { resourcePath } = this.props.editedField.property;

    await documentsService.delete(`${resourcePath}/records/${id}`);
    this.props.deleteCallback(id);
    this.closeDeleteDialog();
  }
}
