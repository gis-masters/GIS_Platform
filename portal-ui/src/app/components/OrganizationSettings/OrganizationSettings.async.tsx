import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { Container } from '@mui/material';
import { cloneDeep } from 'lodash';
import { action, IReactionDisposer, observable, reaction, makeObservable, computed } from 'mobx';

import {
  PropertySchema,
  PropertySchemaChoice,
  PropertyType,
  SimpleSchema
} from '../../services/data/schema/schema.models';
import { organizationSettings, OrgSettings, Settings } from '../../stores/OrganizationSettings.store';
import { EpsgModelModified, isArrayOfEpsgModelModified } from '../../services/data/epsg/epsg.models';
import { organizationsService } from '../../services/auth/organizations/organizations.service';
import { organizationsClient } from '../../services/auth/organizations/organizations.client';
import { isStringArray } from '../../services/util/typeGuards/isStringArray';
import { SelectEPSGControl } from '../SelectEPSGControl/SelectEPSGControl';
import { schemaService } from '../../services/data/schema/schema.service';
import { generateRandomId } from '../../services/util/randomId';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';
import { Form } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./OrganizationSettings.scss';

const cnOrganizationSettings = cn('OrganizationSettings');

export interface OrganizationSettingsProps {
  systemManagement?: boolean;
  orgSettings?: OrgSettings;
}

@observer
export default class OrganizationSettings extends Component<OrganizationSettingsProps> {
  @observable private formValue?: Settings = cloneDeep(
    organizationSettings.orgSettings?.organization || this.props.orgSettings?.system
  );
  @observable private busy = false;
  @observable private _schema?: SimpleSchema;
  @observable private favoritesEpsg: EpsgModelModified[] = [];

  private reactionDisposerOrganizationSettings?: IReactionDisposer;
  private reactionDisposerSystemSettings?: IReactionDisposer;

  constructor(props: OrganizationSettingsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.reactionDisposerOrganizationSettings = reaction(
      () => cloneDeep(organizationSettings.orgSettings),
      () => {
        if (organizationSettings.orgSettings?.organization) {
          this.setFormValue(cloneDeep(organizationSettings.orgSettings.organization));
        }
      },
      {
        fireImmediately: true
      }
    );

    this.reactionDisposerSystemSettings = reaction(
      () => cloneDeep(this.props.orgSettings),
      () => {
        if (this.props.orgSettings?.system) {
          this.setFormValue(cloneDeep(this.props.orgSettings?.system));
        }
      },
      {
        fireImmediately: true
      }
    );

    if (this.formValue) {
      const schema = await schemaService.getSchemaAtUrl(organizationsClient.getOrganizationsSettingsSchemaUrl());

      this.setSchema(schema);
    }
  }

  componentWillUnmount() {
    if (this.reactionDisposerOrganizationSettings && this.reactionDisposerSystemSettings) {
      this.reactionDisposerOrganizationSettings();
      this.reactionDisposerSystemSettings();
    }
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <Container className={cnOrganizationSettings()} maxWidth='md'>
        {organizationSettings.settingsError ? (
          <h1 className={cnOrganizationSettings('Title')}>Настройки видимости элементов управления приложения</h1>
        ) : (
          <>
            {this.formValue && this.schema && (
              <>
                <h1 className={cnOrganizationSettings('Title')}>Управление организацией</h1>
                <Form<Settings>
                  id={htmlId}
                  className={cnOrganizationSettings('Form', ['scroll'])}
                  actionFunction={this.save}
                  schema={this.schema}
                  value={this.formValue}
                  onFieldChange={this.fieldChangeHandler}
                  auto
                  actions={
                    <Button loading={this.busy} form={htmlId} color='primary' type='submit'>
                      Сохранить
                    </Button>
                  }
                />
              </>
            )}

            {!this.formValue && <>Нет настроек организации</>}
          </>
        )}
      </Container>
    );
  }

  @computed
  private get schema(): SimpleSchema | undefined {
    if (this._schema) {
      this.updateOptions();
    }

    return this._schema;
  }

  @boundMethod
  private fieldChangeHandler(value: unknown, propertyName: string, prevValue: unknown, formValue: Settings) {
    if (formValue.favorites_epsg && isArrayOfEpsgModelModified(formValue.favorites_epsg)) {
      this.setFavoritesEpsg(formValue.favorites_epsg);
      this.updateOptions();
    }
  }

  private updateOptions() {
    const options = this.favoritesEpsg.length
      ? this.favoritesEpsg.map(item => {
          return { title: item.title, value: item.title };
        })
      : [];

    this._schema?.properties.forEach(property => {
      if (property.name === 'default_epsg') {
        (property as PropertySchemaChoice).options = options;
      }
    });
  }

  @boundMethod
  private async save(value: Settings) {
    this.setBusy(true);

    const { systemManagement, orgSettings } = this.props;
    const id = systemManagement ? orgSettings?.id : organizationSettings.orgSettings?.id;
    const tags = value.tags;

    if (tags && !Array.isArray(tags)) {
      try {
        const parsedValue = JSON.parse(tags) as unknown;
        if (!isStringArray(parsedValue)) {
          throw new TypeError('Неверный тип данных');
        }

        value.tags = parsedValue;
      } catch {
        throw new Error('Ошибка в типах данных');
      }
    }

    // поле favorites_epsg на бэке сейчас ест только массив стрингов
    value.favorites_epsg = value.favorites_epsg.map(item => JSON.stringify(item));

    if (id) {
      const payload: OrgSettings = { id, settings: value };

      await organizationsService.setOrganizationSettings(payload);
      Toast.success('Настройки успешно обновлены');
    } else {
      Toast.error('Не удалось обновить настройки. Не найдет id организации');
    }

    this.setBusy(false);
  }

  @action
  private setSchema(_schema: SimpleSchema) {
    const properties: PropertySchema[] = _schema.properties.map(prop => {
      if (prop.name === 'favorites_epsg') {
        return {
          name: prop.name,
          multiple: true,
          title: prop.title,
          propertyType: PropertyType.CUSTOM,
          ControlComponent: props => <SelectEPSGControl {...props} />
        };
      }

      return prop;
    });

    _schema.properties = properties;

    this._schema = _schema;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private setFormValue(formValue: Settings): void {
    this.formValue = formValue;
  }

  @action
  private setFavoritesEpsg(favoritesEpsg: EpsgModelModified[]): void {
    this.favoritesEpsg = favoritesEpsg;
  }
}
