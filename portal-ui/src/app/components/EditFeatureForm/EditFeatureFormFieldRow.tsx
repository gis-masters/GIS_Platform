import React, { ReactElement } from 'react';
import { Tooltip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { convertOldToNewProperty } from '../../services/data/schema/schema.utils';
import { EditedField, OldPropertySchema } from '../../services/data/schema/schemaOld.models';
import { EditFeatureContainerFormControl } from '../EditFeatureContainer/hooks/useEditFeatureState';
import { FormDescription } from '../Form/Description/Form-Description';
import FormControlWrapper from '../FormControl/FormControlWrapper';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureForm.scss';

export const cnEditFeatureForm = cn('EditFeatureForm');

interface EditFeatureFormFieldRowProps {
  editFeatureItem: EditedField;
  property: OldPropertySchema;
  formControls: EditFeatureContainerFormControl[];
  handleWrapperChange: (value: unknown, name: string) => void;
  updatingAllowed: boolean;
  mode: 'single' | 'multipleEdit' | undefined;
  isShowTemplate: (property: OldPropertySchema) => boolean;
  handleSwitchControl: (property: OldPropertySchema) => () => void;
  isReadOnly: (property: OldPropertySchema) => boolean;
}

// Вспомогательные функции
const renderLabel = (editFeatureItem: EditedField, property: OldPropertySchema): ReactElement => (
  <div className={cnEditFeatureForm('Label')}>
    {editFeatureItem.isFgistpProperty ? (
      <span>{property.title}</span>
    ) : (
      <Tooltip title='Данное свойство не соответствует приказу'>
        <span style={{ color: 'grey' }}>{property.title}</span>
      </Tooltip>
    )}
    {property.description && <FormDescription>{convertOldToNewProperty(property).description}</FormDescription>}
  </div>
);

const renderFormControl = (
  property: OldPropertySchema,
  editFeatureItem: EditedField,
  formControls: EditFeatureContainerFormControl[],
  handleWrapperChange: (value: unknown, name: string) => void,
  updatingAllowed: boolean
): ReactElement => (
  <FormControlWrapper
    property={property}
    onChange={handleWrapperChange}
    itemValue={formControls.find(({ key }) => key === editFeatureItem.name)?.value}
    error={formControls.find(({ key }) => key === editFeatureItem.name)?.error}
    updatingAllowed={updatingAllowed}
  />
);

const renderMultipleEditControls = (
  property: OldPropertySchema,
  isShowTemplate: (property: OldPropertySchema) => boolean,
  handleSwitchControl: (property: OldPropertySchema) => () => void
): ReactElement => (
  <>
    {isShowTemplate(property) && (
      <div className={cnEditFeatureForm('MultiEdit')}>
        <span>Оставить как есть</span>
      </div>
    )}
    <div className={cnEditFeatureForm('MultipleEditButton')}>
      <IconButton size='small' onClick={handleSwitchControl(property)}>
        <EditOutlined fontSize='small' />
      </IconButton>
    </div>
  </>
);

export const EditFeatureFormFieldRow: React.FC<EditFeatureFormFieldRowProps> = ({
  editFeatureItem,
  property,
  formControls,
  handleWrapperChange,
  updatingAllowed,
  mode,
  isShowTemplate,
  handleSwitchControl,
  isReadOnly
}) => {
  return (
    <div className={cnEditFeatureForm('Row')}>
      {renderLabel(editFeatureItem, property)}
      <div className='col-6 px-0'>
        {isReadOnly(property) && (
          <div>
            {renderFormControl(property, editFeatureItem, formControls, handleWrapperChange, updatingAllowed)}
            {mode === 'multipleEdit' && renderMultipleEditControls(property, isShowTemplate, handleSwitchControl)}
          </div>
        )}
        {!isReadOnly(property) &&
          renderFormControl(property, editFeatureItem, formControls, handleWrapperChange, false)}
      </div>
    </div>
  );
};
