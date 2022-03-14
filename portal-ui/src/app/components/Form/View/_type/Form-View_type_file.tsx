import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { PropertySchemaFile, PropertyType } from '../../../../services/crg/schema.models';
import { FileInfo } from '../../../../services/files.service';
import { Files } from '../../../Files/Files';

import { cnFormView } from '../Form-View';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';

@observer
class FormViewTypeFile extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue } = this.props;
    const value = (fieldValue || []) as FileInfo[];

    return (
      <div className={cnFormView({ inSet }, [className])}>
        {!value.length ? (
          <FormViewValue>—</FormViewValue>
        ) : (
          <Files value={fieldValue as FileInfo[]} property={property as PropertySchemaFile} />
        )}
        <FormViewErrors errors={errors} />
      </div>
    );
  }
}

export const withTypeFile = withBemMod<FormControlProps, FormControlProps>(
  cnFormView(),
  { type: PropertyType.FILE },
  () => FormViewTypeFile
);
