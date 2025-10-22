import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Adjust } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { type PropertySchema } from '../../../../services/data/schema/schema.models';
import { customStyleStrokeColors, type PointRule } from '../../../../services/geoserver/styles/styles.models';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';
import { CustomStyleControlLabelPropertySelect } from '../../LabelPropertySelect/CustomStyleControl-LabelPropertySelect';
import { CustomStyleControlMarkSelect } from '../../MarkSelect/CustomStyleControl-MarkSelect';
import { CustomStyleControlOptionsWrapper } from '../../OptionsWrapper/CustomStyleControl-OptionsWrapper';
import { cnCustomStyleControlForm, type CustomStyleControlFormProps } from '../CustomStyleControl-Form.base';

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

        <CustomStyleControlOptionsWrapper>
          <CustomStyleControlMarkSelect
            label='маркер'
            value={value.rule}
            onChange={this.handleMarkChange}
            color={value.rule.markColor}
          />

          <CustomStyleControlColorSelect
            colors={customStyleStrokeColors}
            value={value.rule.markColor}
            onChange={this.handleColorChange}
          />

          <CustomStyleControlColorSelect
            label='цвет обводки'
            colors={customStyleStrokeColors}
            value={value.rule.strokeColor}
            onChange={this.handleStrokeColorChange}
          />

          <CustomStyleControlLabelPropertySelect
            label='подпись'
            schema={this.props.schema}
            onChange={this.handlerLabelChange}
            labelProperty={value.rule.labelProperty}
          />
        </CustomStyleControlOptionsWrapper>
      </div>
    );
  }

  @boundMethod
  private handlerLabelChange(labelProperty: PropertySchema) {
    const { onChange, value } = this.props;

    if (value.type !== 'point') {
      throw this.ruleTypeError;
    }

    const rule: PointRule = {
      ...value.rule,
      labelProperty
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private handleColorChange(color: string) {
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
  private handleStrokeColorChange(color: string) {
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
  private handleMarkChange(mark: Pick<PointRule, 'markSize' | 'markType'>) {
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
