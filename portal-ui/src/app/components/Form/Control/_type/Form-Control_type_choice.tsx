import React, { Component, type ReactNode } from 'react';
import { observer } from 'mobx-react';
import {
  Box,
  Chip,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import {
  type PropertyOption,
  type PropertySchemaChoice,
  PropertyType
} from '../../../../services/data/schema/schema.models';
import { getMultipleChoiceValue } from '../../../../services/util/form/choiceMultiple.util';
import { isArray } from '../../../../services/util/typeGuards/isArray';
import { isStringArray } from '../../../../services/util/typeGuards/isStringArray';
import { FormErrors } from '../../Errors/Form-Errors';
import { getFieldInputColor } from '../../Form.utils';
import { cnFormControl, type FormControlProps } from '../Form-Control';

import './Form-Control_type_choice.scss';
import '../../ChoiceMenuItem/Form-ChoiceMenuItem.scss';
import '../../ChoiceRenderValue/Form-ChoiceRenderValue.scss';
import '../../ChoiceRenderValueText/Form-ChoiceRenderValueText.scss';

const cnFormChoiceMenuItem = cn('Form', 'ChoiceMenuItem');
const cnFormChoiceRenderValue = cn('Form', 'ChoiceRenderValue');
const cnFormChoiceRenderValueText = cn('Form', 'ChoiceRenderValueText');
const cnFormChoiceChip = cn('Form', 'ChoiceChip');

const EMPTY = '~~~empty_value~~~';
const emptyTitle = 'Не выбрано';

@observer
class FormControlTypeChoice extends Component<FormControlProps> {
  render() {
    const {
      htmlId,
      className,
      property,
      errors,
      warnings,
      fullWidthForOldForm,
      labelInField,
      variant = 'standard'
    } = this.props;

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
              color={getFieldInputColor(errors, warnings)}
              inputProps={{ id: htmlId }}
              // eslint-disable-next-line react/jsx-no-bind -- FIXME #3792
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

                return <span className={cnFormChoiceRenderValue({ invalid: true })}>{selected}</span>;
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
                  {multiple && <Checkbox checked={isArray(value) && value.includes(item.value as string)} />}
                  {item.startIcon}
                  <ListItemText>{item.title}</ListItemText>
                  {item.endIcon}
                </MenuItem>
              ))}

              {/* Добавляем некорректное значение, если его нет в опциях */}
              {!multiple &&
                typeof value === 'string' &&
                value !== EMPTY &&
                !options.some(opt => String(opt.value) === String(value)) && (
                  <MenuItem className={cnFormChoiceMenuItem({ invalid: true })} key={`invalid-${value}`} value={value}>
                    <ListItemText>{value}</ListItemText>
                  </MenuItem>
                )}

              {/* Добавляем некорректные значения для multiple режима */}
              {multiple &&
                isArray(value) &&
                value
                  .filter(val => !options.some(opt => String(opt.value) === String(val)))
                  .map(invalidVal => (
                    <MenuItem
                      className={cnFormChoiceMenuItem({ invalid: true })}
                      key={`invalid-${invalidVal}`}
                      value={invalidVal}
                    >
                      <Checkbox checked />
                      <ListItemText>{invalidVal}</ListItemText>
                    </MenuItem>
                  ))}
            </Select>

            <FormErrors warnings={warnings} errors={errors} />
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
   * Выводит выбранные значения в multiple режиме
   */
  private getMultipleTitle(options: PropertyOption[], jsonValues: string | number | (string | number)[]): ReactNode {
    if (!jsonValues || jsonValues === '' || jsonValues === null || jsonValues === undefined) {
      return null;
    }

    let values: (string | number)[] | undefined = undefined;

    if (isArray(jsonValues)) {
      values = jsonValues;
    } else if (typeof jsonValues === 'string') {
      try {
        values = JSON.parse(jsonValues) as string[];
      } catch {
        return null;
      }
    }

    if (!values || !isArray(values)) {
      return null;
    }

    const chips: ReactNode[] = [];

    values.forEach(val => {
      const option = options.find(opt => String(opt.value) === String(val));
      if (option) {
        chips.push(<Chip key={`chip-${val}`} label={option.title} size='small' />);
      } else {
        chips.push(
          <Chip key={`chip-${val}`} label={String(val)} size='small' className={cnFormChoiceChip({ invalid: true })} />
        );
      }
    });

    if (chips.length === 0) {
      return null;
    }

    return <Box className={cnFormChoiceMenuItem({ type: 'selected' })}>{chips}</Box>;
  }

  @boundMethod
  private handleSelectChange(event: SelectChangeEvent<number | string | string[]>) {
    const { onChange, onNeedValidate, property, fieldValue } = this.props;
    const { multiple } = property as PropertySchemaChoice;

    const nextValue = event.target.value;

    // Конвертируем в финальное значение
    let finalValue: string | string[] | null = null;

    if (!multiple) {
      finalValue = nextValue === EMPTY ? null : String(nextValue);
    } else if (multiple && isStringArray(nextValue) && nextValue.length > 0) {
      // Сохраняем тип исходного значения: если был массив — возвращаем массив, иначе строку
      const wasArray = isArray(fieldValue);
      finalValue = wasArray ? nextValue : JSON.stringify(nextValue);
    }

    // Нормализуем текущее значение
    const normalizedCurrentValue = fieldValue == null || fieldValue === EMPTY ? null : fieldValue;

    // 🔁 Не вызываем onChange, если значение не изменилось
    if (JSON.stringify(normalizedCurrentValue) === JSON.stringify(finalValue)) {
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
    let normalizedCurrentValue: string | null = null;
    if (fieldValue != null && fieldValue !== EMPTY) {
      normalizedCurrentValue = typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue);
    }

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
