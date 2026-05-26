import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import nl2br from 'react-nl2br';

import { type PropertySchemaString, PropertyType } from '../../../../services/data/schema/schema.models';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
import { cnFormView } from '../Form-View.base';

import './Form-View_type_string.scss';

@observer
class FormViewTypeString extends Component<FormControlProps> {
  render() {
    const {
      className,
      property,
      fullWidthForOldForm,
      labelInField,
      errors,
      inSet,
      fieldValue: rawFieldValue
    } = this.props;

    const fieldValue = typeof rawFieldValue === 'string' ? rawFieldValue : '—';

    const { propertyType, display } = property as PropertySchemaString;
    const code = display === 'code';

    return (
      <div
        className={cnFormView(
          { inSet, fullWidthForOldForm, labelInField, empty: fieldValue === '—', type: propertyType, display },
          [className]
        )}
      >
        {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
        <FormViewValue code={code}>
          <TextOverflow>{code ? fieldValue : nl2br(fieldValue)}</TextOverflow>
        </FormViewValue>
        <FormViewWarnings warnings={this.props.warnings} />
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeString = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.STRING },
  () => FormViewTypeString
);
