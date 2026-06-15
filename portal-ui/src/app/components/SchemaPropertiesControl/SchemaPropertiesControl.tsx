import React, { type FC, useCallback, useState } from 'react';

import { type PropertySchema } from '../../services/data/schema/schema.models';
import { isPropertySchema } from '../../services/data/schema/schema.typeguards';
import { isArrayOf } from '../../services/util/typeGuards/isArrayOf';
import { type FormControlProps } from '../Form/Control/Form-Control';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { SchemaPropertiesCreateItem } from '../SchemaProperties/createItem/SchemaProperties-CreateItem';
import { SchemaProperties } from '../SchemaProperties/SchemaProperties';

export const SchemaPropertiesControl: FC<FormControlProps> = ({ fieldValue: properties = [], property, onChange }) => {
  const [createPropertyDialogOpen, setCreatePropertyDialogOpen] = useState(false);

  if (!isArrayOf(properties, isPropertySchema)) {
    throw new TypeError('Ожидается массив PropertySchema');
  }

  const schemaForProperties = {
    name: '',
    title: '',
    properties
  };

  const updateProperties = useCallback(
    (nextProperties: PropertySchema[]) => {
      onChange?.({
        propertyName: property.name,
        value: nextProperties
      });
    },
    [onChange, property.name]
  );

  const handlePropertyChange = useCallback(
    (newProperty: PropertySchema, oldName?: string) => {
      const nextProperties = [...properties];

      const index = nextProperties.findIndex(p => p.name === (oldName ?? newProperty.name));

      if (index !== -1) {
        nextProperties[index] = newProperty;
        updateProperties(nextProperties);
      }
    },
    [properties, updateProperties]
  );

  const handlePropertyDelete = useCallback(
    (propertyName: string) => {
      updateProperties(properties.filter(p => p.name !== propertyName));
    },
    [properties, updateProperties]
  );

  const openCreatePropertyDialog = useCallback(() => {
    setCreatePropertyDialogOpen(true);
  }, []);

  const closeCreatePropertyDialog = useCallback(() => {
    setCreatePropertyDialogOpen(false);
  }, []);

  const createProperty = useCallback(
    (newProperty: PropertySchema): boolean => {
      if (properties.some(p => p.name === newProperty.name)) {
        return false;
      }

      updateProperties([...properties, newProperty]);

      closeCreatePropertyDialog();

      return true;
    },
    [properties, updateProperties, closeCreatePropertyDialog]
  );

  return (
    <>
      <SchemaProperties
        readonly={false}
        editing
        schema={schemaForProperties}
        onPropertyChange={handlePropertyChange}
        onPropertyDelete={handlePropertyDelete}
      />

      <PseudoLink onClick={openCreatePropertyDialog}>Добавить свойство</PseudoLink>

      <SchemaPropertiesCreateItem
        open={createPropertyDialogOpen}
        onClose={closeCreatePropertyDialog}
        onCreate={createProperty}
        existingProperties={properties}
      />
    </>
  );
};
