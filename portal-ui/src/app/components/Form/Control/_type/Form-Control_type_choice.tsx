import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ListItemText, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyType, PropertySchemaChoice } from '../../../../services/data/schema/schema.models';

import { cnFormControl, FormControlProps } from '../Form-Control';
import { FormErrors } from '../../Errors/Form-Errors';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_choice.scss';

const cnFormChoiceMenuItem = cn('Form', 'ChoiceMenuItem');
const cnFormChoiceRenderValue = cn('Form', 'ChoiceRenderValue');
const cnFormChoiceRenderValueText = cn('Form', 'ChoiceRenderValueText');

const EMPTY = '~~~empty_value~~~';

@observer
class FormControlTypeChoice extends Component<FormControlProps> {
  render() {
    const { htmlId, className, property, errors, fullWidthForOldForm, variant = 'standard' } = this.props;
    const { options, name, display = 'select', defaultValue } = property as PropertySchemaChoice;
    let fieldValue = this.props.fieldValue as string;

    if ((display === 'select' && fieldValue === undefined) || fieldValue === null) {
      fieldValue = EMPTY;
    }
    const valueIsAllowed = options.some(({ value }) => String(value) === String(fieldValue));
    const valueCanBeDisplayed =
      fieldValue !== EMPTY && (typeof fieldValue === 'number' || typeof fieldValue === 'string');

    return (
      <div className={cnFormControl({ fullWidthForOldForm }, [className])}>
        {display === 'select' && !!options && (
          <>
            <Select
              id={htmlId}
              name={name}
              fullWidth
              value={fieldValue}
              displayEmpty
              onChange={this.handleChangeSelect}
              error={!!errors?.length}
              renderValue={selected =>
                this.renderValue(selected) || <em>{valueCanBeDisplayed ? fieldValue : 'Не выбрано'}</em>
              }
              variant={variant}
            >
              {!valueIsAllowed && (
                <MenuItem className={cnFormChoiceMenuItem()} value={fieldValue as string | number} color='#666'>
                  <ListItemText>
                    <em>{valueCanBeDisplayed ? fieldValue : 'Не выбрано'}</em>
                  </ListItemText>
                </MenuItem>
              )}

              {options.map((item, i) => {
                return (
                  <MenuItem className={cnFormChoiceMenuItem()} key={i} value={item.value}>
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

  private renderValue(selected: string | number) {
    const { property } = this.props;
    const { options } = property as PropertySchemaChoice;
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
  private handleChangeSelect(event: SelectChangeEvent<string | number>) {
    const { onChange, onNeedValidate, property } = this.props;

    if (onChange) {
      onChange({
        value: event.target.value,
        propertyName: property.name
      });
    }

    if (onNeedValidate) {
      onNeedValidate({
        value: event.target.value,
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
}

export const withTypeChoice = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.CHOICE },
  () => FormControlTypeChoice
);
