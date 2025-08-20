import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from '@mui/material';
import { AssignmentOutlined, Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { http } from '../../../services/api/http.service';
import { EditedField } from '../../../services/data/schema/schemaOld.models';
import { environment } from '../../../services/environment';
import { services } from '../../../services/services';
import { Button } from '../../Button/Button';
import { EditFeatureInfo } from '../../EditFeatureField/EditFeatureField';
import { Link } from '../../Link/Link';
import { Toast } from '../../Toast/Toast';
import { DocumentListItemData } from '../DocumentsList';

import '!style-loader!css-loader!sass-loader!./DocumentsList-Item.scss';
import '!style-loader!css-loader!sass-loader!../Icon/DocumentList-Icon.scss';
import '!style-loader!css-loader!sass-loader!../Content/DocumentList-Content.scss';
import '!style-loader!css-loader!sass-loader!../DeleteButton/DocumentList-DeleteButton.scss';

const cnDocumentsList = cn('DocumentsList');

interface DocumentItemProps {
  document: DocumentListItemData;
  editedField: EditedField;
  featureInfo: EditFeatureInfo;
  onDelete(id: string): void;
}

/**
 * @deprecated
 */
@observer
export class DocumentsListItem extends Component<DocumentItemProps> {
  @observable private isDeleteDocumentDialogOpen = false;
  @observable private downloadUrl = '';
  @observable private deleteUrl = '';

  constructor(props: DocumentItemProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    const { host, path, port, protocol } = environment.server;
    const baseUrl = `${protocol}//${host}${port && ':'}${port}${path}`;
    const { id } = this.props.document;
    const { resourcePath } = this.props.editedField.property;

    const field = 'inner_path'; // temporary binary fieldName of default document library schema
    this.setDownloadUrl(`${baseUrl}${resourcePath}/records/${id}/${field}/download`);
    this.setDeleteUrl(`${baseUrl}${resourcePath}/records/${id}`);
  }

  render() {
    const { document, featureInfo } = this.props;

    return (
      <>
        <div className={cnDocumentsList('Item')}>
          <AssignmentOutlined className={cnDocumentsList('Icon')} color='action' fontSize='small' />

          <Link className={cnDocumentsList('Content')} href={this.downloadUrl} download={document.title}>
            {document.title}
          </Link>

          {featureInfo.isReadOnly && (
            <IconButton className={cnDocumentsList('DeleteButton')} onClick={this.openDeleteDialog} size='small'>
              {this.isDeleteDocumentDialogOpen ? (
                <Delete color='action' fontSize='small' />
              ) : (
                <DeleteOutline color='error' fontSize='small' />
              )}
            </IconButton>
          )}
        </div>

        <Dialog open={this.isDeleteDocumentDialogOpen}>
          <DialogContent>
            <DialogContentText>
              Вы действительно хотите удалить файл?
              <br />
              {document.title}
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
  private setDownloadUrl(url: string) {
    this.downloadUrl = url;
  }

  @action
  private setDeleteUrl(url: string) {
    this.deleteUrl = url;
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
    const { document } = this.props;

    try {
      await http.delete(this.deleteUrl);
    } catch (error) {
      Toast.error('Не удалось удалить файл');
      services.logger.error('Не удалось удалить файл: ', (error as AxiosError).message);
    }

    this.props.onDelete(document.id);
    this.closeDeleteDialog();
  }
}
