import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { Container } from '@mui/material';
import { cloneDeep } from 'lodash';
import { action, IReactionDisposer, observable, reaction, makeObservable } from 'mobx';

import { organizationSettings, OrgSettings } from '../../stores/OrganizationSettings.store';
import { organizationSettingsService } from '../../services/organization-settings';
import { generateRandomId } from '../../services/util/randomId';
import { Schema } from '../../services/data/schema.models';
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
  @observable private formValue: Record<string, boolean> = cloneDeep(
    organizationSettings.orgSettings?.organization || this.props.orgSettings?.system
  );
  @observable private busy = false;
  @observable private schema: Schema<Record<string, unknown>>;

  private reactionDisposerOrganizationSettings: IReactionDisposer;
  private reactionDisposerSystemSettings: IReactionDisposer;

  constructor(props: OrganizationSettingsProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
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
          this.setFormValue(cloneDeep(this.props.orgSettings.system));
        }
      },
      {
        fireImmediately: true
      }
    );

    if (this.formValue) {
      this.setSchema(organizationSettingsService.orgSchema(this.formValue, this.props.systemManagement));
    }
  }

  componentWillUnmount() {
    this.reactionDisposerOrganizationSettings();
    this.reactionDisposerSystemSettings();
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <Container className={cnOrganizationSettings()} maxWidth='md'>
        {organizationSettings.settingsError ? (
          <h1 className={cnOrganizationSettings('Title')}>Настройки видимости элементов управления приложения</h1>
        ) : (
          <>
            {this.formValue && (
              <>
                <h1 className={cnOrganizationSettings('Title')}>Управление организацией</h1>
                <Form
                  id={htmlId}
                  actionFunction={this.save}
                  schema={this.schema}
                  value={this.formValue}
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

  @boundMethod
  private async save(value: Record<string, boolean>) {
    this.setBusy(true);
    const { systemManagement, orgSettings } = this.props;
    const id = systemManagement ? orgSettings.id : organizationSettings.orgSettings.id;
    const payload = { id, settings: value };

    await organizationSettingsService.setOrganizationSettings(payload);
    Toast.success('Настройки успешно обновлены');
    this.setBusy(false);
  }

  @action
  private setSchema(schema: Schema<Record<string, unknown>>) {
    this.schema = schema;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private setFormValue(formValue: Record<string, boolean>) {
    this.formValue = formValue;
  }
}
