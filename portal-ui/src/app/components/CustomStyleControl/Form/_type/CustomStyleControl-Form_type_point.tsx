import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Adjust } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { customStyleStrokeColors, PointRule } from '../../../../services/geoserver/styles/styles.models';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';
import { cnCustomStyleControl } from '../../CustomStyleControl';
import { CustomStyleControlLabelPropertyNameSelect } from '../../LabelPropertyNameSelect/CustomStyleControl-LabelPropertyNameSelect';
import { CustomStyleControlMarkSelect } from '../../MarkSelect/CustomStyleControl-MarkSelect';
import { cnCustomStyleControlForm, CustomStyleControlFormProps } from '../CustomStyleControl-Form.base';

@observer
export class CustomStyleControlFormTypePoint extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value, withIcon } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        {withIcon && <Adjust color='primary' />}

        <div className={cnCustomStyleControl('OptionsWrapper')}>
          <CustomStyleControlMarkSelect
            label='маркер'
            value={value.rule}
            onChange={this.markChangeHandler}
            color={value.rule.markColor}
          />

          <CustomStyleControlColorSelect
            colors={customStyleStrokeColors}
            value={value.rule.markColor}
            onChange={this.colorChangeHandler}
          />

          <CustomStyleControlColorSelect
            label='цвет обводки'
            colors={customStyleStrokeColors}
            value={value.rule.strokeColor}
            onChange={this.strokeColorChangeHandler}
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

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      labelPropertyName
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private colorChangeHandler(color: string) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      markColor: color
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private strokeColorChangeHandler(color: string) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      strokeColor: color
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private markChangeHandler(mark: Pick<PointRule, 'markSize' | 'markType'>) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      markSize: mark.markSize,
      markType: mark.markType,
      strokeWidth: mark.markSize / 10
    };

    onChange({ ...value, rule });
  }
}

export const withTypePoint = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'point' },
  () => CustomStyleControlFormTypePoint
);
