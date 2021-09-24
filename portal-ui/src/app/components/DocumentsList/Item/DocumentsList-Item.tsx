import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { AxiosError } from 'axios';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AssignmentOutlined, Delete, DeleteOutline } from '@material-ui/icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from '@material-ui/core';

import { http } from '../../../services/http.service';
import { services } from '../../../services/services';
import { EditedField } from '../../../services/crg/schemaOld.models';
import { getBaseUrl } from '../../../services/server-urls.service';
import { communicationService } from '../../../services/communication.service';
import { EditFeatureInfo } from '../../EditFeatureField/EditFeatureField';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';
import { Link } from '../../Link/Link';

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
  deleteCallback: (id: string) => void;
}

@observer
export class DocumentsListItem extends Component<DocumentItemProps> {
  @observable private isDeleteDocumentDialogOpen = false;
  @observable private downloadUrl = '';
  @observable private deleteUrl = '';

  async componentDidMount() {
    const baseUrl = await getBaseUrl();
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

          <Link className={cnDocumentsList('Content')} url={this.downloadUrl} download={document.title}>
            {document.title}
          </Link>

          {featureInfo.isReadOnly && (
            <IconButton className={cnDocumentsList('DeleteButton')} onClick={this.openDeleteDialog} size='small'>
              {this.isDeleteDocumentDialogOpen ? (
                <Delete color='action' fontSize='small' />
              ) : (
                <DeleteOutline color='action' fontSize='small' />
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

      communicationService.libraryItemsUpdated.emit();
    } catch (error) {
      Toast.error('Не удалось удалить файл');
      services.logger.error('Не удалось удалить файл: ', (error as AxiosError).message);
    }

    this.props.deleteCallback(document.id);
    this.closeDeleteDialog();
  }
}
