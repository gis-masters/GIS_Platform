import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import nl2br from 'react-nl2br';

import { PropertySchemaString, PropertyType } from '../../../../services/data/schema.models';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';

import { cnFormView } from '../Form-View';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';

import '!style-loader!css-loader!sass-loader!./Form-View_type_string.scss';

@observer
class FormViewTypeString extends Component<FormControlProps> {
  render() {
    const { className, property, fullWidthForOldForm, errors, inSet } = this.props;
    let { fieldValue = '—' } = this.props;

    if (fieldValue === null) {
      fieldValue = '—';
    }

    const { propertyType, display } = property as PropertySchemaString;
    const code = display === 'code';

    return (
      <div
        className={cnFormView({ inSet, fullWidthForOldForm, empty: fieldValue === '—', type: propertyType, display }, [
          className
        ])}
      >
        {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
        <FormViewValue code={code}>
          <TextOverflow value={code ? String(fieldValue) : nl2br(String(fieldValue))} />
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
