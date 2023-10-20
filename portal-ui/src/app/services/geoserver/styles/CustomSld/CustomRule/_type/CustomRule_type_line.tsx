import React, { FC } from 'react';

import { CustomStyleDescription } from '../../../styles.models';

import { LineSymbolizer } from '../../LineSymbolizer/LineSymbolizer';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { Stroke } from '../../Stroke/Stroke';
import { Rule } from '../../Rule/Rule';

export const CustomRuleTypeLine: FC<CustomStyleDescription> = ({ rule, type }) => {
  if (type !== 'line') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  return (
    <Rule>
      <LineSymbolizer>
        <Stroke>
          <SvgParameter name='stroke'>{rule.strokeColor}</SvgParameter>
          <SvgParameter name='stroke-width'>{rule.strokeWidth}</SvgParameter>
          <SvgParameter name='stroke-linejoin'>bevel</SvgParameter>
          {rule.strokeDashArray?.length && (
            <SvgParameter name='stroke-dasharray'>{rule.strokeDashArray.join(' ')}</SvgParameter>
          )}
        </Stroke>
      </LineSymbolizer>
    </Rule>
  );
};
