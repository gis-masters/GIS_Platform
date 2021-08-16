import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { MenuItem, Select } from '@material-ui/core';

import { FieldType, PropertySchemaChoice } from '../../../../services/crg/schemaNew.models';

import { cnFormControl, FormControlProps } from '../Form-Control';

@observer
class FormControlTypeChoice extends Component<FormControlProps> {
  render() {
    const { htmlId, className, fieldValue, property } = this.props;
    const { options } = property as PropertySchemaChoice;

    return (
      <div className={cnFormControl(null, [className])}>
        {!!options && (
          <Select id={htmlId} fullWidth value={fieldValue} onChange={this.handleChange}>
            {options.map((item, i) => {
              return (
                <MenuItem key={i} value={item.value}>
                  {item.title}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </div>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<{ value: unknown }>) {
    const { onChange, property } = this.props;

    onChange({
      value: event.target.value,
      propertyName: property.name
    });
  }
}

export const withTypeChoice = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: FieldType.CHOICE },
  () => FormControlTypeChoice
);
