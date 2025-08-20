import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import nl2br from 'react-nl2br';

import { PropertySchemaString, PropertyType } from '../../../../services/data/schema/schema.models';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';
import { FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { cnFormView } from '../Form-View.base';

import '!style-loader!css-loader!sass-loader!./Form-View_type_string.scss';

@observer
class FormViewTypeString extends Component<FormControlProps> {
  render() {
    const { className, property, fullWidthForOldForm, labelInField, errors, inSet } = this.props;
    let { fieldValue = '—' } = this.props;

    if (fieldValue === null) {
      fieldValue = '—';
    }

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
          <TextOverflow>{code ? String(fieldValue) : nl2br(String(fieldValue))}</TextOverflow>
        </FormViewValue>
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
