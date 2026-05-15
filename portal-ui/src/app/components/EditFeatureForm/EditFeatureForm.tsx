import React, { type FC, useCallback, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type WfsFeature } from 'src/app/services/geoserver/wfs/wfs.models';

import { type EditedField, type OldPropertySchema, ValueType } from '../../services/data/schema/schemaOld.models';
import { convertOldToNewProperty } from '../../services/data/schema/utils/convertOldToNewProperty';
import { type CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { formatDate } from '../../services/util/date.util';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { type EditFeatureFormControl } from '../EditFeature/hooks/useEditFeatureState'; // TODO: запретить линтером ходить в чужие хуки
import { EditFeatureField } from '../EditFeatureField/EditFeatureField';
import { FormDescription } from '../Form/Description/Form-Description';
import { Form } from '../Form/Form';
import FormControlWrapper from '../FormControl/FormControlWrapper';
import { IconButton } from '../IconButton/IconButton';
import { RelationsButton } from '../RelationsButton/RelationsButton';
import { EditFeatureFormFieldRow } from './EditFeatureFormFieldRow';

import './EditFeatureForm.scss';

export const cnEditFeatureForm = cn('EditFeatureForm');

interface EditFeatureFormProps {
  formControls: EditFeatureFormControl[];
  features: WfsFeature[];
  editFeatureData: EditedField[];
  updatingAllowed: boolean;
  layer?: CrgVectorLayer;
  mode?: 'single' | 'multipleEdit';
  setFormControls(formControl: EditFeatureFormControl[]): void;
}

const checkType = (valueType: ValueType | undefined): boolean => {
  return Boolean(
    valueType?.includes('URL') ||
      valueType?.includes('FIAS') ||
      valueType?.includes('BOOLEAN') ||
      valueType?.includes('FILE') ||
      valueType?.includes('STRING') ||
      valueType?.includes('TEXT') ||
      valueType?.includes('LONG') ||
      valueType?.includes('CHOICE') ||
      valueType?.includes('USER') ||
      valueType?.includes('USER_ID') ||
      valueType?.includes('DOCUMENT')
  );
};

const getDateTime = (value: string | null): string => {
  return formatDate(value);
};

export const EditFeatureForm: FC<EditFeatureFormProps> = ({
  formControls,
  features,
  editFeatureData,
  updatingAllowed = false,
  layer,
  mode,
  setFormControls
}) => {
  const handleWrapperChange = useCallback(
    (value: unknown, name: string) => {
      if (setFormControls) {
        const control = formControls.find(({ key }) => key === name);

        if (control) {
          control.value = value;
          control.dirty = true;

          setFormControls([...formControls.filter(({ key }) => key !== name), control]);
        }
      }
      editFeatureStore.setPristine(false);
    },
    [formControls, setFormControls]
  );

  const isShowTemplate = useCallback(
    (property: OldPropertySchema): boolean => {
      const control = formControls.find(({ key }) => key === property.name);

      return control ? Boolean(control.disabled) : false;
    },
    [formControls]
  );

  const isReadOnly = useCallback(
    (property: OldPropertySchema): boolean => {
      if (updatingAllowed) {
        return !property.readOnly;
      }

      return Boolean(updatingAllowed);
    },
    [updatingAllowed]
  );

  const switchControl = useCallback(
    (property: OldPropertySchema): void => {
      if (setFormControls) {
        const updatedFormControls = formControls.map(control => {
          if (control.key === property.name) {
            return {
              ...control,
              disabled: !control.disabled
            };
          }

          return control;
        });

        setFormControls(updatedFormControls);
      }
    },
    [formControls, setFormControls]
  );

  const handleSwitchControl = useCallback(
    (property: OldPropertySchema) => () => {
      switchControl(property);
    },
    [switchControl]
  );

  useEffect(() => {
    if (mode === 'multipleEdit') {
      const updatedFormControls = formControls.map(control => ({
        ...control,
        disabled: true
      }));

      setFormControls(updatedFormControls);
    }
  }, [mode, setFormControls]);

  return (
    !!formControls.length && (
      <Form
        className={cnEditFeatureForm({ multipleEdit: mode === 'multipleEdit', readonly: !updatingAllowed }, ['scroll'])}
        id={'htmlId'}
        auto
        labelInField
      >
        {editFeatureData
          .map((editFeatureItem, i) => {
            const { property, relations } = editFeatureItem;
            if (!property) {
              return;
            }

            const { valueType, title, hidden, description } = property;
            if (hidden) {
              return;
            }

            return (
              <div key={i}>
                {checkType(valueType) && (
                  <div className={cnEditFeatureForm('Row')}>
                    <div className={cnEditFeatureForm('Label')}>
                      {editFeatureItem.isFgistpProperty ? (
                        <span>{title}</span>
                      ) : (
                        <Tooltip title='Данное свойство не соответствует приказу'>
                          <span style={{ color: 'grey' }}>{title}</span>
                        </Tooltip>
                      )}

                      {description && (
                        <FormDescription>{convertOldToNewProperty(property).description}</FormDescription>
                      )}
                    </div>

                    {!(mode === 'multipleEdit' && (valueType?.includes('FILE') || valueType?.includes('LOOKUP'))) && (
                      <div className={cnEditFeatureForm('Fields', { relations: !!relations?.length })}>
                        <FormControlWrapper
                          property={property}
                          onChange={handleWrapperChange}
                          itemValue={formControls.find(({ key }) => key === editFeatureItem.name)?.value}
                          error={formControls.find(({ key }) => key === editFeatureItem.name)?.error}
                          updatingAllowed={updatingAllowed}
                        />

                        <div>
                          {!!relations?.length && (
                            <RelationsButton obj={features[0].properties} relations={relations} />
                          )}
                        </div>

                        {isShowTemplate(property) && (
                          <div className={cnEditFeatureForm('MultiEdit')}>
                            <span>Оставить как есть</span>
                          </div>
                        )}

                        {mode === 'multipleEdit' && (
                          <div className={cnEditFeatureForm('MultipleEditButton')}>
                            <IconButton size='small' onClick={handleSwitchControl(property)}>
                              <EditOutlined fontSize='small' />
                            </IconButton>
                          </div>
                        )}

                        {mode === 'multipleEdit' && (valueType?.includes('FILE') || valueType?.includes('LOOKUP')) && (
                          <div className='col-6 px-0 new-form-fields not-editable-form-fields'>
                            <div className='not-editable'>
                              <span>Недоступно для множественного редактирования</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {valueType?.includes('LOOKUP') && mode === 'single' && (
                  <div className={cnEditFeatureForm('Row')}>
                    <EditFeatureField
                      type={ValueType.LOOKUP}
                      field={editFeatureItem}
                      featureInfo={{
                        feature: features[0],
                        layerName: layer ? layer.resourceId : '',
                        isReadOnly: Boolean(updatingAllowed)
                      }}
                    />
                  </div>
                )}

                {valueType?.includes('DATETIME') &&
                  (() => {
                    const controlItem = formControls.find(({ key }) => key === editFeatureItem.name);
                    const value = typeof controlItem?.value === 'string' ? getDateTime(controlItem.value) : null;

                    return (
                      <div className={cnEditFeatureForm('Row')}>
                        <div className={cnEditFeatureForm('Label')}>
                          {editFeatureItem.isFgistpProperty ? (
                            <span>{property.title}</span>
                          ) : (
                            <Tooltip title='Данное свойство не соответствует приказу'>
                              <span style={{ color: 'grey' }}>{property.title}</span>
                            </Tooltip>
                          )}
                          {property.description && (
                            <FormDescription>{convertOldToNewProperty(property).description}</FormDescription>
                          )}
                        </div>
                        <div className='col-6 px-0'>
                          {isReadOnly(property) && (
                            <div>
                              <FormControlWrapper
                                property={property}
                                onChange={handleWrapperChange}
                                itemValue={formControls.find(({ key }) => key === editFeatureItem.name)?.value}
                                error={formControls.find(({ key }) => key === editFeatureItem.name)?.error}
                                updatingAllowed={updatingAllowed}
                              />

                              {formControls.find(({ key }) => key === editFeatureItem.name)?.error && (
                                <span className='input-group-text error-badge'>
                                  <span className='crg-errors-icon'>
                                    {formControls.find(({ key }) => key === editFeatureItem.name)?.error}
                                  </span>
                                </span>
                              )}

                              {mode === 'multipleEdit' && (
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
                              )}
                            </div>
                          )}

                          {!isReadOnly(property) && (
                            <FormControlWrapper
                              property={property}
                              onChange={handleWrapperChange}
                              itemValue={value}
                              updatingAllowed={false}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {(valueType?.includes('INT') || valueType?.includes('DOUBLE')) && (
                  <EditFeatureFormFieldRow
                    editFeatureItem={editFeatureItem}
                    property={property}
                    formControls={formControls}
                    handleWrapperChange={handleWrapperChange}
                    updatingAllowed={updatingAllowed}
                    mode={mode}
                    isShowTemplate={isShowTemplate}
                    handleSwitchControl={handleSwitchControl}
                    isReadOnly={isReadOnly}
                  />
                )}
              </div>
            );
          })
          .filter(notFalsyFilter)}
      </Form>
    )
  );
};
