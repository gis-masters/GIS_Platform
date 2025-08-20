import React, { Component } from 'react';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Container } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { organizationsClient } from '../../services/auth/organizations/organizations.client';
import { organizationsService } from '../../services/auth/organizations/organizations.service';
import { isArrayOfProjections, isProjection, Projection } from '../../services/data/projections/projections.models';
import { PropertySchemaChoice, PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { generateRandomId } from '../../services/util/randomId';
import { isStringArray } from '../../services/util/typeGuards/isStringArray';
import { CompositeSettings, organizationSettings, OrgSettings } from '../../stores/OrganizationSettings.store';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { SelectFavoriteProjectionsControl } from '../SelectFavoriteProjectionsControl/SelectFavoriteProjectionsControl';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./OrganizationSettings.scss';

const typeError = 'Ошибка в типах данных';

const cnOrganizationSettings = cn('OrganizationSettings');

export interface OrganizationSettingsProps {
  systemManagement?: boolean;
  orgSettings?: CompositeSettings;
}

@observer
export default class OrganizationSettings extends Component<OrganizationSettingsProps> {
  @observable private formValue?: OrgSettings = cloneDeep(
    organizationSettings.orgSettings?.organization || this.props.orgSettings?.system
  );
  @observable private busy = false;
  @observable private _schema?: SimpleSchema;
  @observable private favoritesProjection: Projection[] = [];

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
          const formValue = organizationSettings.orgSettings.organization;

          if (typeof organizationSettings.orgSettings.system?.storageSize === 'number') {
            formValue.storageSize = Number(organizationSettings.orgSettings.system?.storageSize);
          }

          this.setFormValue(cloneDeep(formValue));
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
                <Form<OrgSettings>
                  id={htmlId}
                  className={cnOrganizationSettings('Form', ['scroll'])}
                  actionFunction={this.save}
                  schema={this.schema}
                  value={this.formValue}
                  onFieldChange={this.handleFieldChange}
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
  private handleFieldChange(value: unknown, propertyName: string, prevValue: unknown, formValue: OrgSettings) {
    if (formValue.favorites_epsg && isArrayOfProjections(formValue.favorites_epsg)) {
      this.setFavoritesProjection(formValue.favorites_epsg);
      this.updateOptions();
    }
  }

  private updateOptions() {
    const options = this.favoritesProjection.length
      ? this.favoritesProjection.map(item => {
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
  private async save(value: OrgSettings) {
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
        throw new Error(typeError);
      }
    }

    // поле favorites_epsg на бэке сейчас ест только массив строк
    value.favorites_epsg = value.favorites_epsg.map(projection => {
      if (typeof projection === 'string') {
        try {
          const parsedValue = JSON.parse(projection) as unknown;

          if (!isProjection(parsedValue)) {
            throw new TypeError('Неверное значение у системы координат');
          }

          return projection;
        } catch {
          throw new Error('Ошибка получения системы координат');
        }
      }

      return isProjection(projection) ? JSON.stringify(projection) : projection;
    });

    if (id) {
      const payload: CompositeSettings = { id, settings: value };

      await organizationsService.setOrganizationSettings(payload);
      Toast.success('Настройки успешно обновлены');
    } else {
      Toast.error('Не удалось обновить настройки. Не найдет id организации');
    }

    this.setBusy(false);
  }

  @action
  private setSchema(_schema: SimpleSchema) {
    _schema.properties = _schema.properties.map(prop => {
      if (prop.name === 'favorites_epsg') {
        return {
          name: prop.name,
          multiple: true,
          title: prop.title,
          propertyType: PropertyType.CUSTOM,
          ControlComponent: props => <SelectFavoriteProjectionsControl {...props} />
        };
      }

      return prop;
    });

    this._schema = _schema;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private setFormValue(formValue: OrgSettings): void {
    this.formValue = formValue;
  }

  @action
  private setFavoritesProjection(favoritesProjection: Projection[]): void {
    this.favoritesProjection = favoritesProjection;
  }
}
