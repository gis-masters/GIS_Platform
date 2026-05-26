import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { type PropertySchemaChoice, PropertyType } from '../../../../services/data/schema/schema.models';
import { TextOverflow } from '../../../TextOverflow/TextOverflow';
import { type FormControlProps } from '../../Control/Form-Control';
import { FormSetLabel } from '../../SetLabel/Form-SetLabel';
import { FormViewErrors } from '../../ViewErrors/Form-ViewErrors';
import { FormViewWarnings } from '../../ViewWarnings/Form-ViewWarnings';
import { cnFormView } from '../Form-View.base';

import './Form-View_type_choice.scss';

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
          <FormViewWarnings warnings={this.props.warnings} />
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
