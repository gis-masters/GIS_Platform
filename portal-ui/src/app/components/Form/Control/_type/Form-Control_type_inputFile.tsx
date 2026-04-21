import React, { type FC, useCallback } from 'react';
import { withBemMod } from '@bem-react/core';

import { type PropertySchemaInputFile, PropertyType } from '../../../../services/data/schema/schema.models';
import { FileInput } from '../../../FileInput/FileInput';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, type FormControlProps } from '../Form-Control';

const FormControlTypeInputFile: FC<FormControlProps> = ({ className, property, fieldValue, errors, onChange }) => {
  const { accept } = property as PropertySchemaInputFile;

  const handleChange = useCallback(
    (files: FileList | null) => {
      onChange?.({
        value: files?.[0] ?? null,
        propertyName: property.name
      });
    },
    [onChange, property.name]
  );

  const file = fieldValue instanceof File ? fieldValue : null;

  return (
    <div className={cnFormControl(null, [className])}>
      <FileInput accept={accept} buttonCaption={file ? file.name : 'Выбрать файл'} onChange={handleChange} fullWidth />
      <FormErrors errors={errors} />
    </div>
  );
};

export const withTypeInputFile = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.INPUT_FILE },
  () => FormControlTypeInputFile
);
