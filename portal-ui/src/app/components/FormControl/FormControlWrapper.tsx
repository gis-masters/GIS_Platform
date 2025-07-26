import React, { FC, useCallback, useEffect, useState } from 'react';

import { PropertyType } from '../../services/data/schema/schema.models';
import { convertOldToNewProperties } from '../../services/data/schema/schema.utils';
import { OldPropertySchema, ValueType } from '../../services/data/schema/schemaOld.models';
import { ErrorMessages, validateField } from '../../services/util/FeaturePropertyValidatorsReact';
import { FormControlProps } from '../Form/Control/Form-Control';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { FormView } from '../Form/View/Form-View.composed';

interface FormControlWrapperProps {
  property: OldPropertySchema;
  updatingAllowed: boolean;
  itemValue: unknown;
  error?: string;
  onChange?: (value: unknown, name: string) => void;
}

const checkType = (valueType: ValueType | undefined): boolean => {
  return Boolean(
    valueType?.includes('FIAS') ||
      valueType?.includes('BOOLEAN') ||
      valueType?.includes('USER') ||
      valueType?.includes('USER_ID')
  );
};

const FormControlWrapper: FC<FormControlWrapperProps> = ({ property, itemValue, updatingAllowed, error, onChange }) => {
  const [updating, setUpdatingAllowed] = useState<boolean>(updatingAllowed);
  const [properties, setProperties] = useState<FormControlProps>();

  const handleChange = useCallback(
    ({ value }: { value: unknown }) => {
      onChange?.(value, property.name);
    },
    [onChange, property.name]
  );

  useEffect(() => {
    if (!property) {
      return;
    }

    let currentValue: unknown = itemValue;

    const [convertedProperty] = convertOldToNewProperties([property]);
    if (typeof itemValue === 'string' && convertedProperty.propertyType === PropertyType.FILE) {
      currentValue = JSON.parse(itemValue);
    }

    setUpdatingAllowed(updatingAllowed);

    if (updatingAllowed) {
      setUpdatingAllowed(!convertedProperty.readOnly);
    }

    let errors: ErrorMessages = {};

    if (!checkType(property.valueType)) {
      const validationResult = validateField(itemValue, property);
      errors = validationResult.errors || {};
    }

    const errorArray = [...(Object.values(errors) as string[]).flat(), ...(error ? [error] : [])].filter(Boolean);

    setProperties({
      property: convertedProperty,
      errors: errorArray,
      type: convertedProperty.propertyType,
      fieldValue: currentValue,
      formRole: 'viewDocument',
      variant: 'outlined',
      onChange: handleChange,
      fullWidthForOldForm: true
    });
  }, [error, handleChange, itemValue, property, updatingAllowed]);

  return properties && (updating ? <FormControl {...properties} /> : <FormView {...properties} />);
};

export default React.memo(FormControlWrapper);
