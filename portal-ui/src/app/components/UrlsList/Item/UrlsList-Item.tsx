import React, { Component, ComponentType } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, Tooltip } from '@mui/material';

import { UrlInfo } from '../../Form/Control/_type/Form-Control_type_url';
import { FormDialogProps } from '../../FormDialog/FormDialog';
import { Link } from '../../Link/Link';
import { PseudoLink } from '../../PseudoLink/PseudoLink';
import { IconButton } from '../../IconButton/IconButton';
import { HtmlContent } from '../../HtmlContent/HtmlContent';
import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';
import { getEditUrlFormSchema } from '../../Form/Form.utils';
import { PropertySchemaUrl } from '../../../services/crg/schema.models';
import { FormProps } from '../../Form/Form';

import '!style-loader!css-loader!sass-loader!../Placeholder/UrlsList-Placeholder.scss';
import '!style-loader!css-loader!sass-loader!../Button/UrlsList-Button.scss';
import '!style-loader!css-loader!sass-loader!../Link/UrlsList-Link.scss';
import '!style-loader!css-loader!sass-loader!../Dialog/UrlsList-Dialog.scss';

interface UrlFieldItemProps {
  onDelete: (index: number) => void;
  onEdit: (value: UrlInfo, index: number) => void;
  index: number;
  item: UrlInfo;
  editable: boolean;
  property: PropertySchemaUrl;
  Form: ComponentType<FormProps<Record<string, unknown>>>;
  FormDialog: ComponentType<FormDialogProps<UrlInfo>>;
}

const cnUrlsList = cn('UrlsList');

@observer
export class UrlsListItem extends Component<UrlFieldItemProps> {
  @observable private editDialogOpen = false;
  @observable private viewDialogOpen = false;
  @observable private content = '';
  @observable private fetching = false;

  render() {
    const { item, FormDialog, property, editable, Form } = this.props;
    const { openIn, multiple } = property;
    const text = item.text ? item.text : item.url;

    return (
      <>
        <div className={cnUrlsList('Item')}>
          {!text && <span className={cnUrlsList('Placeholder')}>ссылка</span>}
          {openIn === 'newTab' ? (
            <Link className={cnUrlsList('Link')} href={item.url} target='_blank'>
              {text}
            </Link>
          ) : (
            <PseudoLink className={cnUrlsList('Link')} onClick={this.openDialog} disabled={false}>
              {text}
            </PseudoLink>
          )}

          {editable && (
            <Tooltip title='Редактировать'>
              <span>
                <IconButton className={cnUrlsList('Button')} size='small' onClick={this.openEditDialog}>
                  <EditOutlined fontSize='inherit' />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {multiple && editable && (
            <Tooltip title='Удалить'>
              <span>
                <IconButton className={cnUrlsList('Button')} size='small' onClick={this.deleteUrl}>
                  <DeleteOutlined fontSize='inherit' />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </div>

        {editable && (
          <FormDialog
            Form={Form}
            open={this.editDialogOpen}
            fields={getEditUrlFormSchema(property)}
            value={item}
            actionFunction={this.editUrl}
            actionButtonProps={{ children: 'Сохранить' }}
            onClose={this.closeEditDialog}
            title='Редактирование ссылки'
          />
        )}

        <Dialog
          open={this.viewDialogOpen}
          onClose={this.closeViewDialog}
          maxWidth='xl'
          fullWidth
          PaperProps={{ className: cnUrlsList('Dialog') }}
        >
          <DialogContent>
            <HtmlContent content={this.content} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeViewDialog}>Закрыть</Button>
          </DialogActions>
          {this.content ? null : <Loading />}
        </Dialog>
      </>
    );
  }

  @action.bound
  private deleteUrl() {
    this.props.onDelete(this.props.index);
  }

  @action.bound
  private editUrl(formValue: UrlInfo) {
    this.props.onEdit(formValue, this.props.index);
    this.closeEditDialog();
  }

  @action.bound
  private openEditDialog() {
    this.editDialogOpen = true;
  }

  @action.bound
  private closeEditDialog() {
    this.editDialogOpen = false;
  }

  private async openViewDialog() {
    this.viewDialogOpen = true;

    if (!this.content && !this.fetching) {
      this.setFetching(true);
      try {
        const response = await fetch(this.props.item.url);
        const content = await response.text();
        this.setContent(content);
      } catch {
        this.setContent('Ошибка!');
      }
      this.setFetching(false);
    }
  }

  @action
  private setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  @action
  private setContent(content: string) {
    this.content = content;
  }

  @action.bound
  private openDialog() {
    void this.openViewDialog();
  }

  @action.bound
  private closeViewDialog() {
    this.viewDialogOpen = false;
    location.hash = '';
  }
}
