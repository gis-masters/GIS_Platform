import React, { ChangeEvent, Component } from 'react';
import { observer } from 'mobx-react';
import { Input, SelectChangeEvent } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';

import { PointRule, customStyleStrokeColors } from '../../../../services/geoserver/styles/styles.models';
import { TileSelect } from '../../../TileSelect/TileSelect';

import { CustomStyleControlFormProps, cnCustomStyleControlForm } from '../CustomStyleControl-Form.base';
import { CustomStyleControlColorTile } from '../../ColorTile/CustomStyleControl-ColorTile';
import { CustomStyleControlLabel } from '../../Label/CustomStyleControl-Label';

@observer
class CustomStyleControlFormTypePoint extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        <CustomStyleControlLabel>цвет маркера</CustomStyleControlLabel>
        <TileSelect
          value={value.rule.markColor}
          options={customStyleStrokeColors.map(color => ({
            tile: <CustomStyleControlColorTile color={color} />,
            value: color
          }))}
          onChange={this.onMarkColorChange}
        />

        <CustomStyleControlLabel>размер маркера</CustomStyleControlLabel>
        <Input value={value.rule.markSize} type='number' onChange={this.onMarkSizeChange} />
      </div>
    );
  }

  @boundMethod
  private onMarkColorChange(e: SelectChangeEvent<unknown>) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    if (typeof e.target.value !== 'string') {
      throw new TypeError('Ошибка при выборе цвета');
    }

    const rule: PointRule = {
      ...value.rule,
      markColor: e.target.value
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private onMarkSizeChange(e: ChangeEvent<HTMLInputElement>) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      markSize: Number(e.target.value)
    };

    onChange({ ...value, rule });
  }
}

export const withTypePoint = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'point' },
  () => CustomStyleControlFormTypePoint
);
