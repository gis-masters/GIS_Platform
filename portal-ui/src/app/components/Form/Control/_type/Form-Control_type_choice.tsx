import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
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
import Checkbox from '@mui/material/Checkbox';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertyOption, PropertySchemaChoice, PropertyType } from '../../../../services/data/schema/schema.models';
import { getMultipleChoiceValue } from '../../../../services/util/form/choiceMultiple.util';
import { isStringArray } from '../../../../services/util/typeGuards/isStringArray';
import { FormErrors } from '../../Errors/Form-Errors';
import { cnFormControl, FormControlProps } from '../Form-Control';

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

    // Устанавливаем начальное значение
    if (display === 'select' && (fieldValue === undefined || fieldValue === null)) {
      fieldValue = multiple ? '' : EMPTY;
    }

    const value = multiple ? getMultipleChoiceValue(fieldValue) : fieldValue;

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
              inputProps={{ id: htmlId }}
              renderValue={selected => {
                if (multiple) {
                  const title = this.getMultipleTitle(options, selected);

                  return title || <em>{emptyTitle}</em>;
                }

                if (selected === EMPTY) {
                  return <em>{emptyTitle}</em>;
                }

                const option = options.find(opt => String(opt.value) === String(selected));
                if (option?.title) {
                  return (
                    <div className={cnFormChoiceRenderValue()}>
                      {option.startIcon}
                      <div className={cnFormChoiceRenderValueText()}>{option.title}</div>
                      {option.endIcon}
                    </div>
                  );
                }

                return <em>{emptyTitle}</em>;
              }}
              variant={variant}
            >
              {/* Показываем "Не выбрано" только в одиночном режиме */}
              {!multiple && (
                <MenuItem className={cnFormChoiceMenuItem()} key='empty' value={EMPTY}>
                  <ListItemText sx={{ fontStyle: 'italic', color: '#666' }}>{emptyTitle}</ListItemText>
                </MenuItem>
              )}

              {/* Все опции */}
              {options.map((item, i) => (
                <MenuItem className={cnFormChoiceMenuItem()} key={i} value={item.value}>
                  {multiple && <Checkbox checked={Array.isArray(value) && value.includes(item.value as string)} />}
                  {item.startIcon}
                  <ListItemText>{item.title}</ListItemText>
                  {item.endIcon}
                </MenuItem>
              ))}
            </Select>

            <FormErrors errors={errors} />
          </>
        )}

        {display === 'buttongroup' && (
          <ToggleButtonGroup
            size='small'
            color='primary'
            value={fieldValue || defaultValue}
            exclusive={!multiple}
            onChange={this.handleChangeButtonToggle}
          >
            {!multiple && (
              <ToggleButton size='small' value={EMPTY}>
                {emptyTitle}
              </ToggleButton>
            )}
            {options.map((item, i) => (
              <ToggleButton size='small' key={i} value={item.value}>
                {item.title}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </div>
    );
  }

  /**
   * Рендерит выбранные значения в multiple режиме
   */
  private getMultipleTitle(options: PropertyOption[], jsonValues: string | number | (string | number)[]): ReactNode {
    if (!jsonValues || jsonValues === '' || jsonValues === null || jsonValues === undefined) {
      return null;
    }

    let values: (string | number)[] | undefined = undefined;

    if (Array.isArray(jsonValues)) {
      values = jsonValues;
    } else if (typeof jsonValues === 'string') {
      try {
        values = JSON.parse(jsonValues) as string[];
      } catch {
        return null;
      }
    }

    if (!values || !Array.isArray(values)) {
      return null;
    }

    const checkedOptions = options.filter(option => values?.includes(option.value as string));
    const titles = checkedOptions.map(option => option.title);

    if (titles.length === 0) {
      return null;
    }

    return (
      <Box className={cnFormChoiceMenuItem({ type: 'selected' })}>
        {titles.map((value, i) => (
          <Chip key={i} label={value} size='small' />
        ))}
      </Box>
    );
  }

  @boundMethod
  private handleSelectChange(event: SelectChangeEvent<number | string | string[]>) {
    const { onChange, onNeedValidate, property, fieldValue } = this.props;
    const { multiple } = property as PropertySchemaChoice;

    const nextValue = event.target.value;

    // Конвертируем в финальное значение
    let finalValue: string | null = null;

    if (!multiple) {
      finalValue = nextValue === EMPTY ? null : String(nextValue);
    } else if (multiple && isStringArray(nextValue)) {
      finalValue = nextValue.length === 0 ? null : JSON.stringify(nextValue);
    }

    // Нормализуем текущее значение
    const normalizedCurrentValue = fieldValue == null || fieldValue === EMPTY ? null : String(fieldValue);

    // 🔁 Не вызываем onChange, если значение не изменилось
    if (normalizedCurrentValue === finalValue) {
      return;
    }

    onChange?.({ value: finalValue, propertyName: property.name });
    onNeedValidate?.({ value: finalValue, propertyName: property.name });
  }

  @boundMethod
  private handleChangeButtonToggle(event: React.MouseEvent<HTMLElement, MouseEvent>, value: string) {
    const { onChange, onNeedValidate, property, fieldValue } = this.props;
    const { multiple } = property as PropertySchemaChoice;

    // Конвертируем EMPTY → null
    const finalValue = !multiple && value === EMPTY ? null : value;

    // Нормализуем текущее значение
    const normalizedCurrentValue = fieldValue == null || fieldValue === EMPTY ? null : String(fieldValue);

    // 🔁 Не вызываем, если не изменилось
    if (normalizedCurrentValue === finalValue) {
      return;
    }

    onChange?.({ value: finalValue, propertyName: property.name });
    onNeedValidate?.({ value: finalValue, propertyName: property.name });
  }
}

export const withTypeChoice = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.CHOICE },
  () => FormControlTypeChoice
);
