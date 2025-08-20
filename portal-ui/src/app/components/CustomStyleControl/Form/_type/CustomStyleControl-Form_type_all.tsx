import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { CustomStyleDescription } from '../../../../services/geoserver/styles/styles.models';
import { cnCustomStyleControlForm, CustomStyleControlFormProps } from '../CustomStyleControl-Form.base';
import { CustomStyleControlFormTypeLine } from './CustomStyleControl-Form_type_line';
import { CustomStyleControlFormTypePoint } from './CustomStyleControl-Form_type_point';
import { CustomStyleControlFormTypePolygon } from './CustomStyleControl-Form_type_polygon';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-Form_type_all.scss';

@observer
class CustomStyleControlFormTypeAll extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value, schema } = this.props;

    if (value.type !== 'all') {
      throw this.ruleTypeError;
    }

    const [pointRule, lineRule, polygonRule] = value.rule;

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        <Paper square elevation={2} variant='outlined'>
          <CustomStyleControlFormTypePoint
            type='line'
            schema={schema}
            value={{ type: 'point', rule: pointRule }}
            withIcon
            onChange={this.handlePartChange}
          />
        </Paper>

        <Paper square elevation={2} variant='outlined'>
          <CustomStyleControlFormTypeLine
            type='line'
            schema={schema}
            value={{ type: 'line', rule: lineRule }}
            withIcon
            onChange={this.handlePartChange}
          />
        </Paper>

        <Paper square elevation={2} variant='outlined'>
          <CustomStyleControlFormTypePolygon
            type='polygon'
            schema={schema}
            value={{ type: 'polygon', rule: polygonRule }}
            withIcon
            onChange={this.handlePartChange}
          />
        </Paper>
      </div>
    );
  }

  @boundMethod
  private handlePartChange(partValue: CustomStyleDescription) {
    const { onChange, value } = this.props;

    if (value.type !== 'all') {
      throw this.ruleTypeError;
    }

    onChange({
      type: 'all',
      rule: [
        partValue.type === 'point' ? partValue.rule : value.rule[0],
        partValue.type === 'line' ? partValue.rule : value.rule[1],
        partValue.type === 'polygon' ? partValue.rule : value.rule[2]
      ]
    });
  }
}

export const withTypeAll = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'all' },
  () => CustomStyleControlFormTypeAll
);
