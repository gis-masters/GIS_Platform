import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { PolylineOutlined } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { customStyleStrokeColors, LineRule } from '../../../../services/geoserver/styles/styles.models';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';
import { cnCustomStyleControl } from '../../CustomStyleControl';
import { CustomStyleControlLabelPropertyNameSelect } from '../../LabelPropertyNameSelect/CustomStyleControl-LabelPropertyNameSelect';
import { CustomStyleControlStrokeSelect } from '../../StrokeSelect/CustomStyleControl-StrokeSelect';
import { cnCustomStyleControlForm, CustomStyleControlFormProps } from '../CustomStyleControl-Form.base';

@observer
export class CustomStyleControlFormTypeLine extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value, withIcon } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        {withIcon && <PolylineOutlined color='primary' />}

        <div className={cnCustomStyleControl('OptionsWrapper')}>
          <CustomStyleControlStrokeSelect
            label='линия'
            value={value.rule}
            color={value.rule.strokeColor}
            onChange={this.strokeChangeHandler}
          />

          <CustomStyleControlColorSelect
            colors={customStyleStrokeColors}
            value={value.rule.strokeColor}
            onChange={this.colorChangeHandler}
          />

          <CustomStyleControlLabelPropertyNameSelect
            label='подпись'
            schema={this.props.schema}
            onChange={this.labelChangeHandler}
            value={value.rule.labelPropertyName}
          />
        </div>
      </div>
    );
  }

  @boundMethod
  private labelChangeHandler(labelPropertyName: string) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    const rule: LineRule = {
      ...value.rule,
      labelPropertyName
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private strokeChangeHandler(stroke: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    const rule: LineRule = {
      ...value.rule,
      strokeDashArray: stroke.strokeDashArray,
      strokeWidth: stroke.strokeWidth
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private colorChangeHandler(color: string) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    const rule: LineRule = {
      ...value.rule,
      strokeColor: color
    };

    onChange({ ...value, rule });
  }
}

export const withTypeLine = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'line' },
  () => CustomStyleControlFormTypeLine
);
