import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Adjust } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';

import { PointRule, customStyleStrokeColors } from '../../../../services/geoserver/styles/styles.models';

import { CustomStyleControlFormProps, cnCustomStyleControlForm } from '../CustomStyleControl-Form.base';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';
import { CustomStyleControlMarkSelect } from '../../MarkSelect/CustomStyleControl-MarkSelect';

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
      </div>
    );
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
  private markChangeHandler(mark: Pick<PointRule, 'markSize' | 'markType'>) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      markSize: mark.markSize,
      markType: mark.markType
    };

    onChange({ ...value, rule });
  }
}

export const withTypePoint = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'point' },
  () => CustomStyleControlFormTypePoint
);
