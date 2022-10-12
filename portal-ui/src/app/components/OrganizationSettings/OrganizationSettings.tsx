import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { Container } from '@mui/material';
import { cloneDeep } from 'lodash';
import { action, IReactionDisposer, observable, reaction, makeObservable } from 'mobx';

import { PropertyType, Schema } from '../../services/data/schema.models';
import { organizationSettingsService } from '../../services/organization-settings';
import { organizationSettings, Settings } from '../../stores/OrganizationSettings.store';
import { generateRandomId } from '../../services/util/randomId';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./OrganizationSettings.scss';

const cnOrganizationSettings = cn('OrganizationSettings');

const schema: Schema<Settings> = {
  properties: [
    {
      name: 'createProject',
      title: 'Создание проекта',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'dataManagement',
      title: 'Управление данными',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'editProjectLayer',
      title: 'Настройка слоев проекта',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'createLibraryItem',
      title: 'Создание элементов в библиотеке',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'downloadFiles',
      title: 'Скачать документ',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'downloadXml',
      title: 'Скачивание xml межевого плана и выгрузка координат и геометрии',
      propertyType: PropertyType.BOOL
    }
  ]
};

const defaultValue = {
  createLibraryItem: false,
  createProject: false,
  dataManagement: false,
  downloadFiles: false,
  downloadXml: false,
  editProjectLayer: false
};

@observer
export class OrganizationSettings extends Component {
  @observable private formValue: Settings = cloneDeep(organizationSettings.settings);
  @observable private busy = false;

  private reactionDisposer: IReactionDisposer;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.reactionDisposer = reaction(
      () => cloneDeep(organizationSettings.settings),
      () => {
        this.setFormValue(cloneDeep(organizationSettings.settings));
      },
      {
        fireImmediately: true
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <Container className={cnOrganizationSettings()} maxWidth='md'>
        {organizationSettings.settingsError ? (
          <h1 className={cnOrganizationSettings('Title')}>Настройки видимости элементов управления приложения</h1>
        ) : (
          <Form
            id={htmlId}
            onFormSubmit={this.save}
            onActionSuccess={this.save}
            schema={schema}
            value={this.formValue || defaultValue}
            auto
            actions={
              <Button loading={this.busy} form={htmlId} color='primary' type='submit'>
                Сохранить
              </Button>
            }
          />
        )}
      </Container>
    );
  }

  @boundMethod
  private async save(value) {
    this.setBusy(true);
    await organizationSettingsService.setOrganizationSettings(value as Settings);
    Toast.success('Настройки успешно обновлены');
    this.setBusy(false);
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private setFormValue(formValue: Settings) {
    this.formValue = formValue;
  }
}
