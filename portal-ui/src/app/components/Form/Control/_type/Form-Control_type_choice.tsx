import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import Checkbox from '@mui/material/Checkbox';
import {
  Box,
  Chip,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { isStringArray } from '../../../../services/util/typeGuards/isStringArray';
import { getMultipleChoiceValue } from '../../../../services/util/form/choiceMultiple.util';
import { PropertyType, PropertySchemaChoice, PropertyOption } from '../../../../services/data/schema/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_choice.scss';
import '!style-loader!css-loader!sass-loader!../../ChoiceMenuItem/Form-ChoiceMenuItem.scss';
import '!style-loader!css-loader!sass-loader!../../ChoiceRenderValue/Form-ChoiceRenderValue.scss';
import '!style-loader!css-loader!sass-loader!../../ChoiceRenderValueText/Form-ChoiceRenderValueText.scss';

const cnFormChoiceMenuItem = cn('Form', 'ChoiceMenuItem');
const cnFormChoiceRenderValue = cn('Form', 'ChoiceRenderValue');
const cnFormChoiceRenderValueText = cn('Form', 'ChoiceRenderValueText');

const EMPTY = '~~~empty_value~~~';
const emptyTitle = 'Не выбрано';

@observer
class FormControlTypeChoice extends Component<FormControlProps> {
  render() {
    const { htmlId, className, property, errors, fullWidthForOldForm, labelInField, variant = 'standard' } = this.props;

    if (property.propertyType !== PropertyType.CHOICE) {
      throw new Error('Ошибка типа свойства');
    }

    const { options, name, display = 'select', defaultValue, multiple } = property;
    let fieldValue = this.props.fieldValue as string;

    if ((display === 'select' && fieldValue === undefined) || fieldValue === null) {
      fieldValue = multiple ? '' : EMPTY;
    }

    const value = multiple ? getMultipleChoiceValue(fieldValue) : fieldValue;

    const valueCanBeDisplayed = !multiple && this.valueCanBeDisplayed(fieldValue);

    const renderOptions = multiple ? options.filter(option => option.title !== emptyTitle) : options;

    return (
      <div className={cnFormControl({ fullWidthForOldForm, labelInField }, [className])}>
        {display === 'select' && !!options && (
          <>
            {labelInField && (
              <InputLabel shrink htmlFor={htmlId}>
                {property.title}
              </InputLabel>
            )}

            <Select
              id={htmlId}
              name={name}
              fullWidth
              value={value}
              displayEmpty
              multiple={multiple}
              onChange={this.handleSelectChange}
              error={!!errors?.length}
              inputProps={{
                id: htmlId
              }}
              renderValue={selected => {
                if (multiple) {
                  return this.renderValue(selected, value);
                }

                return this.renderValue(selected) || <em>{valueCanBeDisplayed ? fieldValue : emptyTitle}</em>;
              }}
              variant={variant}
            >
              {!this.isAllowedValues(options, !!multiple, value) &&
                (Array.isArray(value) ? value.filter(item => !this.valueInOptions(item, options)) : [value]).map(
                  (item, i) => {
                    return (
                      <MenuItem className={cnFormChoiceMenuItem()} key={i} value={item} color='#666'>
                        {multiple && <Checkbox checked={value.includes(item)} />}
                        <ListItemText>
                          <em>{this.valueCanBeDisplayed(item) ? item : emptyTitle}</em>
                        </ListItemText>
                      </MenuItem>
                    );
                  }
                )}

              {renderOptions.map((item, i) => {
                return (
                  <MenuItem className={cnFormChoiceMenuItem()} key={i} value={item.value}>
                    {multiple && <Checkbox checked={value.includes(item.value as string)} />}
                    {item.startIcon}
                    {<ListItemText>{item.title}</ListItemText>}
                    {item.endIcon}
                  </MenuItem>
                );
              })}
            </Select>
            <FormErrors errors={errors} />
          </>
        )}
        {display === 'buttongroup' && (
          <ToggleButtonGroup
            size='small'
            color='primary'
            value={fieldValue || defaultValue}
            exclusive
            onChange={this.handleChangeButtonToggle}
          >
            {options.map((item, i) => {
              return (
                <ToggleButton size='small' key={i} value={item.value}>
                  {item.title}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        )}
      </div>
    );
  }

  private isAllowedValues(options: PropertyOption[], multiple: boolean, valueForSelect: string | string[]): boolean {
    if (multiple && Array.isArray(valueForSelect)) {
      return valueForSelect.every(item => this.valueInOptions(item, options));
    }

    return options.some(({ value }) => String(value) === String(valueForSelect));
  }

  private valueInOptions(value: string | number, options: PropertyOption[]): boolean {
    return options.some(option => String(option.value) === String(value));
  }

  private getMultipleTitle(options: PropertyOption[], jsonValues: string | number | (string | number)[]): ReactNode {
    if (typeof jsonValues === 'number') {
      return [<em key={jsonValues}>{jsonValues}</em>];
    }

    if (!jsonValues || jsonValues === '' || jsonValues === null || jsonValues === undefined) {
      return <em>{emptyTitle}</em>;
    }

    let values: (string | number)[] | undefined = undefined;

    if (Array.isArray(jsonValues)) {
      values = jsonValues;
    }

    if (typeof jsonValues === 'string') {
      try {
        values = JSON.parse(jsonValues) as string[];
      } catch {
        //do nothing
      }
    }

    if (values && !Array.isArray(values)) {
      return [values];
    }

    if (values !== null && Array.isArray(values)) {
      const checkedOptions = options.filter(option => values?.includes(option.value as string));
      const notInOptionsValues = values
        .filter(value => options.every(option => option.value !== value))
        .map((item, idx) => <em key={idx}>{item}</em>);

      const titles = checkedOptions.map(option => option.title);

      const titlesForRender = notInOptionsValues.length
        ? [...notInOptionsValues, ...titles].filter(option => option !== emptyTitle)
        : titles.filter(option => option !== emptyTitle);

      if (!titlesForRender.length) {
        return <em>{emptyTitle}</em>;
      }

      return (
        <Box className={cnFormChoiceMenuItem({ type: 'selected' })}>
          {titlesForRender.map((value, i) => (
            <Chip key={i} label={value} />
          ))}
        </Box>
      );
    }
  }

  private renderValue(selected: string | string[] | number, value?: string | string[]) {
    const { property } = this.props;
    const { options, multiple } = property as PropertySchemaChoice;

    if (multiple && value) {
      return this.getMultipleTitle(options, value);
    }

    const option = options.find(({ value }) => String(value) === String(selected));

    if (option?.startIcon || option?.title || option?.endIcon) {
      return (
        <div className={cnFormChoiceRenderValue()}>
          {option.startIcon} <div className={cnFormChoiceRenderValueText()}>{option.title}</div> {option.endIcon}
        </div>
      );
    }
  }

  @boundMethod
  private handleSelectChange(event: SelectChangeEvent<number | string | string[]>) {
    const { onChange, onNeedValidate, property } = this.props;
    const { multiple } = property as PropertySchemaChoice;

    const value =
      multiple && isStringArray(event.target.value)
        ? JSON.stringify(event.target.value.filter(item => item !== EMPTY))
        : event.target.value;

    if (onChange) {
      onChange({
        value,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value,
        propertyName: property.name
      });
    }
  }

  @boundMethod
  private handleChangeButtonToggle(event: React.MouseEvent<HTMLElement, MouseEvent>, value: string) {
    const { onChange, onNeedValidate, property } = this.props;

    if (onChange) {
      onChange({
        value: value,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value: value,
        propertyName: property.name
      });
    }
  }

  private valueCanBeDisplayed(value: string | number): boolean {
    return value !== EMPTY && (typeof value === 'number' || typeof value === 'string');
  }
}

export const withTypeChoice = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.CHOICE },
  () => FormControlTypeChoice
);
