import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, Tooltip } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { PropertySchemaUrl } from '../../../services/data/schema/schema.models';
import { getUrlSubFormSchema } from '../../../services/util/form/fieldUrl';
import { Button } from '../../Button/Button';
import { UrlInfo } from '../../Form/Control/_type/Form-Control_type_url';
import { FormDialog } from '../../FormDialog/FormDialog';
import { HtmlContent } from '../../HtmlContent/HtmlContent';
import { IconButton } from '../../IconButton/IconButton';
import { Link } from '../../Link/Link';
import { Loading } from '../../Loading/Loading';
import { PseudoLink } from '../../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!../Placeholder/UrlsList-Placeholder.scss';
import '!style-loader!css-loader!sass-loader!../Button/UrlsList-Button.scss';
import '!style-loader!css-loader!sass-loader!../Link/UrlsList-Link.scss';

interface UrlFieldItemProps {
  index: number;
  item: UrlInfo;
  editable: boolean;
  property: PropertySchemaUrl;
  onDelete(index: number): void;
  onEdit(value: UrlInfo, index: number): void;
}

const cnUrlsList = cn('UrlsList');

@observer
export class UrlsListItem extends Component<UrlFieldItemProps> {
  @observable private editDialogOpen = false;
  @observable private viewDialogOpen = false;
  @observable private content = '';
  @observable private fetching = false;

  constructor(props: UrlFieldItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { item, property, editable } = this.props;
    const { openIn } = property;
    const text = item.text || item.url;

    return (
      <>
        <div className={cnUrlsList('Item')}>
          {!text && <span className={cnUrlsList('Placeholder')}>ссылка</span>}
          {openIn === 'popup' ? (
            <PseudoLink className={cnUrlsList('Link')} onClick={this.openDialog} disabled={false}>
              {text}
            </PseudoLink>
          ) : (
            <Link className={cnUrlsList('Link')} href={item.url} target='_blank'>
              {text}
            </Link>
          )}

          {editable && (
            <>
              <Tooltip title='Редактировать'>
                <IconButton className={cnUrlsList('Button')} size='small' onClick={this.openEditDialog}>
                  <EditOutlined fontSize='inherit' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Удалить'>
                <IconButton className={cnUrlsList('Button')} size='small' onClick={this.deleteUrl}>
                  <DeleteOutlined color='error' fontSize='inherit' />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>

        {editable && (
          <FormDialog
            open={this.editDialogOpen}
            schema={{ properties: getUrlSubFormSchema(property) }}
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
        this.setContent('Ошибка перехода по ссылке ' + this.props.item.url);
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
