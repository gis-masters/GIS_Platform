import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { FileInfo } from '../../../../services/data/files/files.models';
import { LibraryRecord } from '../../../../services/data/library/library.models';
import { PropertySchemaFile, PropertyType } from '../../../../services/data/schema/schema.models';
import { Files } from '../../../Files/Files';
import { FormControlProps } from '../../Control/Form-Control';
import { FormViewErrors } from '../../ViewErrors/ViewErrors-ViewErrors';
import { FormViewValue } from '../../ViewValue/Form-ViewValue';
import { cnFormView } from '../Form-View.base';

@observer
class FormViewTypeFile extends Component<FormControlProps> {
  render() {
    const { className, inSet, property, errors, fieldValue, formRole, formValue, fullWidthForOldForm } = this.props;
    let value = (fieldValue || []) as FileInfo[];

    try {
      if (fieldValue && typeof fieldValue === 'string') {
        value = JSON.parse(fieldValue) as FileInfo[];
      }
    } catch {
      value = [];
    }

    return (
      <div className={cnFormView({ inSet, fullWidthForOldForm }, [className])}>
        {value.length ? (
          <Files
            showPlaceAction={formRole === 'viewDocument'}
            value={value}
            document={formRole === 'viewDocument' ? (formValue as LibraryRecord) : undefined}
            property={property as PropertySchemaFile}
          />
        ) : (
          <FormViewValue>—</FormViewValue>
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
