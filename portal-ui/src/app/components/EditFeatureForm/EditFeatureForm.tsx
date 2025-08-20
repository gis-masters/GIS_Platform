import React, { useCallback, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { WfsFeature } from 'src/app/services/geoserver/wfs/wfs.models';

import { convertOldToNewProperty } from '../../services/data/schema/schema.utils';
import { EditedField, OldPropertySchema, ValueType } from '../../services/data/schema/schemaOld.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { formatDate } from '../../services/util/date.util';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { EditFeatureContainerFormControl } from '../EditFeatureContainer/hooks/useEditFeatureState';
import { EditFeatureField } from '../EditFeatureField/EditFeatureField';
import { FormDescription } from '../Form/Description/Form-Description';
import { Form } from '../Form/Form';
import FormControlWrapper from '../FormControl/FormControlWrapper';
import { IconButton } from '../IconButton/IconButton';
import { RelationsButton } from '../RelationsButton/RelationsButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureForm.scss';

export const cnEditFeatureForm = cn('EditFeatureForm');

interface EditFeatureFormProps {
  formControls: EditFeatureContainerFormControl[];
  features: WfsFeature[];
  editFeatureData: EditedField[];
  updatingAllowed: boolean;
  layer?: CrgVectorLayer;
  mode?: 'single' | 'multipleEdit';
  setFormControls: (formControl: EditFeatureContainerFormControl[]) => void;
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

export const EditFeatureForm: React.FC<EditFeatureFormProps> = ({
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

  const isShowTemplate = (property: OldPropertySchema): boolean => {
    const control = formControls.find(({ key }) => key === property.name);

    return control ? Boolean(control.disabled) : false;
  };

  const isReadOnly = (property: OldPropertySchema): boolean => {
    if (updatingAllowed) {
      return !property.readOnly;
    }

    return Boolean(updatingAllowed);
  };

  const switchControl = (property: OldPropertySchema): void => {
    if (setFormControls) {
      const control = formControls.find(({ key }) => key === property.name);

      if (control) {
        control.disabled = !control?.disabled;

        setFormControls([...formControls.filter(({ key }) => key !== property.name), control]);
      }
    }
  };

  useEffect(() => {
    const shouldDisable = mode === 'multipleEdit';
    const updatedFormControls = formControls.map(control => ({
      ...control,
      disabled: shouldDisable
    }));

    setFormControls(updatedFormControls);
  }, [mode]);

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
                            <IconButton size='small' onClick={() => switchControl(property)}>
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
                        layerName: layer ? layer.tableName : '',
                        isReadOnly: Boolean(updatingAllowed)
                      }}
                    />
                  </div>
                )}

                {valueType?.includes('DATETIME') && (
                  <div className={cnEditFeatureForm('Row')}>
                    <div className={cnEditFeatureForm('Label')}>
                      {!editFeatureItem.isFgistpProperty && <span style={{ color: 'grey' }}>{title}</span>}

                      {editFeatureItem.isFgistpProperty && <span>{title}</span>}

                      {description && (
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
                                <IconButton size='small' onClick={() => switchControl(property)}>
                                  <EditOutlined fontSize='small' />
                                </IconButton>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {!isReadOnly(property) &&
                        (() => {
                          const controlItem = formControls.find(({ key }) => key === editFeatureItem.name);
                          const value = typeof controlItem?.value === 'string' ? getDateTime(controlItem.value) : null;

                          return (
                            <FormControlWrapper
                              property={property}
                              onChange={handleWrapperChange}
                              itemValue={value}
                              updatingAllowed={false}
                            />
                          );
                        })()}
                    </div>
                  </div>
                )}

                {valueType?.includes('INT') && (
                  <div className={cnEditFeatureForm('Row')}>
                    <div className={cnEditFeatureForm('Label')}>
                      {!editFeatureItem.isFgistpProperty && (
                        <span
                          style={{ color: 'grey' }}
                          // matTooltip="Данное свойство не соответствует приказу"
                        >
                          {title}
                        </span>
                      )}
                      {editFeatureItem.isFgistpProperty && <span>{title}</span>}
                      {description && (
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

                          {mode === 'multipleEdit' && (
                            <>
                              {isShowTemplate(property) && (
                                <div className={cnEditFeatureForm('MultiEdit')}>
                                  <span>Оставить как есть</span>
                                </div>
                              )}

                              <div className={cnEditFeatureForm('MultipleEditButton')}>
                                <IconButton size='small' onClick={() => switchControl(property)}>
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
                          itemValue={formControls.find(({ key }) => key === editFeatureItem.name)?.value}
                          error={formControls.find(({ key }) => key === editFeatureItem.name)?.error}
                          updatingAllowed={false}
                        />
                      )}
                    </div>
                  </div>
                )}

                {valueType?.includes('DOUBLE') && (
                  <div className={cnEditFeatureForm('Row')}>
                    <div className={cnEditFeatureForm('Label')}>
                      {!editFeatureItem.isFgistpProperty && <span style={{ color: 'grey' }}>{title}</span>}

                      {editFeatureItem.isFgistpProperty && <span>{title}</span>}

                      {description && (
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

                          {mode === 'multipleEdit' && (
                            <>
                              {isShowTemplate(property) && (
                                <div className={cnEditFeatureForm('MultiEdit')}>
                                  <span>Оставить как есть</span>
                                </div>
                              )}

                              <div className={cnEditFeatureForm('MultipleEditButton')}>
                                <IconButton size='small' onClick={() => switchControl(property)}>
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
                          itemValue={formControls.find(({ key }) => key === editFeatureItem.name)?.value}
                          error={formControls.find(({ key }) => key === editFeatureItem.name)?.error}
                          updatingAllowed={false}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
          .filter(notFalsyFilter)}
      </Form>
    )
  );
};
