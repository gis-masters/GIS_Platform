import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertyType, PropertySchemaChoice } from '../../../../services/data/schema.models';

import { cnFormView } from '../Form-View';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';

import '!style-loader!css-loader!sass-loader!./Form-View_type_choice.scss';

const EMPTY = '~~~empty_value~~~';

@observer
class FormViewTypeChoice extends Component<FormControlProps> {
  render() {
    const { className, fieldValue = EMPTY, property, errors, inSet } = this.props;
    const { options } = property as PropertySchemaChoice;
    const title = options.find(({ value }) => String(value) === String(fieldValue))?.title;
    const valueCanBeDisplayed =
      fieldValue !== EMPTY && (typeof fieldValue === 'number' || typeof fieldValue === 'string');

    return (
      <div className={cnFormView({ inSet, empty: !title && !valueCanBeDisplayed }, [className])}>
        <>
          {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
          {title || (valueCanBeDisplayed ? fieldValue : '—')}
          <FormViewErrors errors={errors} />
        </>
      </div>
    );
  }
}

export const withTypeChoice = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.CHOICE },
  () => FormViewTypeChoice
);
