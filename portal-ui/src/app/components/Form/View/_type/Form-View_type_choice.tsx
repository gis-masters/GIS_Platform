import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaChoice, PropertyType } from '../../../../services/data/schema/schema.models';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';
import { FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

import '!style-loader!css-loader!sass-loader!./Form-View_type_choice.scss';

const EMPTY = '~~~empty_value~~~';

@observer
class FormViewTypeChoice extends Component<FormControlProps> {
  render() {
    const { className, property, fullWidthForOldForm, fieldValue = EMPTY, errors, inSet } = this.props;
    const { options } = property as PropertySchemaChoice;
    const title = options.find(({ value }) => String(value) === String(fieldValue))?.title;
    const valueCanBeDisplayed =
      fieldValue !== EMPTY && (typeof fieldValue === 'number' || typeof fieldValue === 'string');

    return (
      <div className={cnFormView({ inSet, fullWidthForOldForm, empty: !title && !valueCanBeDisplayed }, [className])}>
        <>
          {inSet && <FormSetLabel>{property.title}:</FormSetLabel>}
          <TextOverflow>{title || (valueCanBeDisplayed ? fieldValue : '—')}</TextOverflow>
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
