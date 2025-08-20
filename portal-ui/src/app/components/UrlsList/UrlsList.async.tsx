import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaUrl } from '../../services/data/schema/schema.models';
import { getUrlSubFormSchema, parseUrlValue } from '../../services/util/form/fieldUrl';
import { UrlInfo } from '../Form/Control/_type/Form-Control_type_url';
import { FormViewValue } from '../Form/ViewValue/Form-ViewValue';
import { FormDialog } from '../FormDialog/FormDialog';
import { UrlsListItem } from './Item/UrlsList-Item';

import '!style-loader!css-loader!sass-loader!./UrlsList.scss';

export interface UrlsListProps extends IClassNameProps {
  value: string;
  editable?: boolean;
  property: PropertySchemaUrl;
  onChange?(value: string): void;
}

const cnUrlsList = cn('UrlsList');
const cnUrlsListDialog = cn('UrlsList', 'Dialog');

@observer
export default class UrlsList extends Component<UrlsListProps> {
  @observable private createDialogOpen = false;

  constructor(props: UrlsListProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className, property, editable = false } = this.props;

    return (
      <div className={cnUrlsList(null, [className])}>
        {!this.value.length && !editable && <FormViewValue>—</FormViewValue>}
        {this.value?.map((item, index) => (
          <UrlsListItem
            key={index}
            item={item}
            index={index}
            editable={editable}
            property={property}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
          />
        ))}

        {((!property.multiple && this.value.length < 1) || property.multiple) && editable && (
          <Tooltip title='Добавить URL'>
            <span>
              <IconButton onClick={this.openCreateDialog} className={cnUrlsList('AddUrl')}>
                <AddCircleOutline color='primary' fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {editable && (
          <FormDialog
            open={this.createDialogOpen}
            className={cnUrlsListDialog()}
            schema={{ properties: getUrlSubFormSchema(property) }}
            value={{ url: '', text: '' }}
            actionFunction={this.createUrl}
            actionButtonProps={{ children: 'Сохранить' }}
            onClose={this.closeCreateDialog}
            title='Добавление ссылки'
          />
        )}
      </div>
    );
  }

  @boundMethod
  private handleChange(formValue: UrlInfo[]) {
    const { onChange } = this.props;

    onChange?.(JSON.stringify(formValue));
  }

  @computed
  private get value(): UrlInfo[] {
    const { value, property, editable } = this.props;
    const { multiple } = property;

    return parseUrlValue(value, multiple, editable);
  }

  @action.bound
  private createUrl(formValue: UrlInfo) {
    this.handleChange([...this.value, formValue]);
    this.closeCreateDialog();
  }

  @action.bound
  private onEdit(itemValue: UrlInfo, index: number) {
    const urlList = [...this.value];
    urlList[index] = itemValue;

    this.handleChange(urlList);
  }

  @action.bound
  private onDelete(index: number) {
    const urlList = [...this.value];
    urlList.splice(index, 1);

    this.handleChange(urlList);
  }

  @action.bound
  private openCreateDialog() {
    this.createDialogOpen = true;
  }

  @action.bound
  private closeCreateDialog() {
    this.createDialogOpen = false;
  }
}
