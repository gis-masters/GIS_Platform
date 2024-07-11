import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaUrl, PropertyType } from '../../../../services/data/schema/schema.models';
import { UrlsList } from '../../../UrlsList/UrlsList';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { cnFormView } from '../Form-View.base';

import '!style-loader!css-loader!sass-loader!./Form-View_type_url.scss';

@observer
class FormViewTypeUrl extends Component<FormControlProps> {
  render() {
    const { className, errors, inSet, property, fieldValue } = this.props;

    return (
      <div className={cnFormView({ inSet }, [className])}>
        <UrlsList value={fieldValue as string} property={property as PropertySchemaUrl} editable={false} />
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeUrl = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.URL },
  () => FormViewTypeUrl
);
