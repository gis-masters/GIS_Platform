/* eslint-disable max-params */
import { useEffect, useRef } from 'react';
import { isEqual, isNumber } from 'lodash';

import { type Schema } from '../../../services/data/schema/schema.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import {
  applyView,
  applyViewOld,
  changeSchemaNamesCaseByFeature,
  convertNewToOldSchema,
  convertOldToNewProperties,
  convertOldToNewSchema,
  getFieldRelations
} from '../../../services/data/schema/schema.utils';
import {
  type EditedField,
  type OldPropertySchema,
  type OldSchema,
  ValueType
} from '../../../services/data/schema/schemaOld.models';
import { type WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import {
  type CrgVectorableLayer,
  type CrgVectorLayer,
  isVectorLayer
} from '../../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { formatDate, systemFormat } from '../../../services/util/date.util';
import { validateCustomRules } from '../../../services/util/FeaturePropertyValidatorsReact';
import { convertToComplexField } from '../../Form/Form.utils';
import { type EditFeatureFormControl } from './useEditFeatureState';

function editFeaturePropertyToString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

export const useFeatureFormGenerator = (
  currentFeature: WfsFeature,
  formControls: EditFeatureFormControl[],
  mode: EditFeatureMode,
  setFormControls: (formControls: EditFeatureFormControl[]) => void,
  setEditFeatureData: (editFeatureData: EditedField[]) => void,
  setFeatureDescription: (featureDescription: OldSchema | undefined) => void,
  layerSchema?: Schema,
  featureDescription?: OldSchema,
  layer?: CrgVectorableLayer | CrgVectorLayer
): void => {
  const currentDepsRef = useRef<EditFeatureFormControl[]>();

  useEffect(() => {
    if (!layerSchema || !currentFeature || !featureDescription || !layer) {
      return;
    }

    if (formControls.length && isEqual(currentDepsRef.current, formControls)) {
      return;
    }

    currentDepsRef.current = formControls;

    const oldSchema = convertNewToOldSchema(layerSchema);
    const view = isVectorLayer(layer) ? layer.view : undefined;
    const featureWithChangedNames = changeSchemaNamesCaseByFeature(oldSchema, currentFeature);
    const currentDesc = applyViewOld(featureWithChangedNames, view);
    const propertiesWithAppliedView = applyView(layerSchema, view).properties;
    const changedNames = featureWithChangedNames.properties;

    const featureProps = currentDesc.properties;
    featureProps.forEach(({ name, valueType }) => {
      if (!Object.keys(currentFeature.properties).includes(name) && valueType !== ValueType.GEOMETRY) {
        currentFeature.properties[name] = null;
      }
    });

    const convertedProperties = convertOldToNewProperties(featureProps);
    const newEditFeatureData: EditedField[] = [];
    const newFormControls: EditFeatureFormControl[] = [];

    Object.keys(currentFeature.properties)
      .filter(key => {
        const inNew = propertiesWithAppliedView.some(p => p.name.toLowerCase() === key.toLowerCase());
        const inOld = changedNames.some(p => p.name.toLowerCase() === key.toLowerCase());

        return inNew || (!inNew && !inOld);
      })
      .toSorted((a, b) => {
        let indexA = propertiesWithAppliedView.findIndex(({ name }) => name.toLowerCase() === a.toLowerCase());
        if (indexA === -1) {
          indexA = propertiesWithAppliedView.length;
        }
        let indexB = propertiesWithAppliedView.findIndex(({ name }) => name.toLowerCase() === b.toLowerCase());
        if (indexB === -1) {
          indexB = propertiesWithAppliedView.length;
        }

        return indexA - indexB;
      })
      .forEach(key => {
        const propertyByKey = convertedProperties.find(({ name }) => name.toLowerCase() === key.toLowerCase());

        let currentProperty = propertyByKey
          ? convertToComplexField(propertyByKey, currentFeature.properties)
          : currentFeature.properties[key];

        let property: OldPropertySchema | undefined;
        if (featureDescription) {
          property = schemaService.getPropertySchemaByName(key, featureProps);
        }

        if (
          property?.valueType === ValueType.DOUBLE &&
          currentProperty &&
          isNumber(property.fractionDigits) &&
          property.fractionDigits !== -1
        ) {
          currentProperty = Number(currentProperty).toFixed(property.fractionDigits);
        }

        if (property?.valueType === ValueType.DATETIME && currentProperty) {
          currentProperty =
            currentProperty instanceof Date ||
            typeof currentProperty === 'number' ||
            typeof currentProperty === 'string'
              ? formatDate(currentProperty, systemFormat)
              : '';
        }

        if (
          (property?.valueType === ValueType.STRING || property?.valueType === ValueType.TEXT) &&
          currentProperty &&
          typeof currentProperty === 'string'
        ) {
          currentProperty = currentProperty.trim();
        }

        const formControlValue = formControls.find(control => control.key === key);

        if (formControlValue && (formControlValue.value !== null || formControlValue.value !== undefined)) {
          currentProperty = formControlValue.value;
        }

        if (featureDescription) {
          if (property) {
            newEditFeatureData.push({
              name: key,
              property,
              value: currentProperty === null ? null : editFeaturePropertyToString(currentProperty),
              isFgistpProperty: true,
              relations: getFieldRelations(key, convertOldToNewSchema(featureDescription))
            });

            const currentControl = formControls.find(item => item.key === key);

            let disabled = currentControl?.disabled;

            if (currentControl?.disabled === undefined) {
              disabled = property.name === 'GLOBALID' || mode === EditFeatureMode.multipleEdit;
            }

            newFormControls.push({
              ...currentControl,
              key: key,
              value: currentProperty,
              disabled
            });
          } else {
            newEditFeatureData.push({
              name: key,
              property: {
                name: key,
                title: key,
                hidden: key === 'emptyFeature',
                valueType: ValueType.STRING
              },
              value: currentProperty === null ? null : editFeaturePropertyToString(currentProperty),
              isFgistpProperty: false,
              relations: getFieldRelations(key, convertOldToNewSchema(featureDescription))
            });

            const currentControl = formControls.find(item => item.key === key);

            newFormControls.push({
              ...currentControl,
              key: key,
              value: currentProperty,
              disabled: mode === EditFeatureMode.multipleEdit
            });
          }
        }
      });

    const validateRules = (featureProperties: { [key: string]: unknown }): EditFeatureFormControl[] => {
      if (!featureDescription) {
        return [];
      }

      const controlsWithErrors: EditFeatureFormControl[] = [];

      for (const validationError of validateCustomRules(
        featureProperties,
        featureDescription.customRuleFunction,
        featureDescription.tableName
      )) {
        const control = formControls.find(({ key }) => key === validationError.attribute);

        if (control) {
          controlsWithErrors.push({ ...control, error: validationError.error });
        }
      }

      return controlsWithErrors;
    };

    const formControlsErrors = validateRules(currentFeature.properties);

    // Создаем Map для быстрого поиска ошибок по ключу
    const errorsMap = new Map(formControlsErrors.map(control => [control.key, control.error]));

    // Обновляем newFormControls, сохраняя порядок
    const updatedFormControls = newFormControls.map(control => {
      // Если для этого контрола есть ошибка, добавляем ее
      if (errorsMap.has(control.key)) {
        return { ...control, error: errorsMap.get(control.key) };
      }

      return control;
    });

    setEditFeatureData(newEditFeatureData);
    setFormControls(updatedFormControls);
  }, [
    layerSchema,
    currentFeature,
    formControls,
    featureDescription,
    layer,
    mode,
    setFormControls,
    setEditFeatureData,
    setFeatureDescription
  ]);
};
