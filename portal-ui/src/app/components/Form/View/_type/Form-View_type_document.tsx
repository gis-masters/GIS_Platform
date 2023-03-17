import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaDocument, PropertyType } from '../../../../services/data/schema/schema.models';
import { DocumentInfo, Documents } from '../../../Documents/Documents';

import { cnFormView } from '../Form-View';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';

@observer
class FormViewTypeDocument extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue } = this.props;

    let value: DocumentInfo[];

    try {
      value = JSON.parse(String(fieldValue)) as DocumentInfo[];
      if (!Array.isArray(value)) {
        value = [];
      }
    } catch {
      value = [];
    }

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {!value.length ? (
          <FormViewValue>—</FormViewValue>
        ) : (
          <Documents property={property as PropertySchemaDocument} value={value} />
        )}
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeDocument = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.DOCUMENT },
  () => FormViewTypeDocument
);
