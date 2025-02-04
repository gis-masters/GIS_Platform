import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaUrl, PropertyType } from '../../../../services/data/schema/schema.models';
import { UrlsList } from '../../../UrlsList/UrlsList';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

export interface UrlInfo extends Record<string, unknown> {
  url: string;
  text: string;
}

@observer
class FormControlTypeUrl extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue, fullWidthForOldForm } = this.props;

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <UrlsList
          value={fieldValue as string}
          property={property as PropertySchemaUrl}
          editable
          onChange={this.handleChange}
        />
        <FormErrors errors={errors} />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: string) {
    const { onChange, onNeedValidate, property } = this.props;

    if (onChange) {
      onChange({
        value,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value,
        propertyName: property.name
      });
    }
  }
}

export const withTypeUrl = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.URL },
  () => FormControlTypeUrl
);
