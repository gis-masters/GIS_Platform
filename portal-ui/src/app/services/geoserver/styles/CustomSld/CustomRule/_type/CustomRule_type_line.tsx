import React, { FC, Fragment } from 'react';

import { LineSymbolizer } from '../../LineSymbolizer/LineSymbolizer';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { Stroke } from '../../Stroke/Stroke';
import { Rule } from '../../Rule/Rule';
import { CustomRuleProps } from '../CustomRule';
import { Filter } from '../../Filter/Filter';
import { PropertyIsEqualTo } from '../../PropertyIsEqualTo/PropertyIsEqualTo';
import { Function } from '../../Function/Function';
import { Literal } from '../../Literal/Literal';

export const CustomRuleTypeLine: FC<CustomRuleProps> = ({ rule, type, bare }) => {
  if (type !== 'line') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  const Wrapper = bare ? Fragment : Rule;

  return (
    <Wrapper>
      <Filter>
        <PropertyIsEqualTo>
          <Function name='dimension'>
            <Function name='geometry' />
          </Function>
          <Literal>1</Literal>
        </PropertyIsEqualTo>
      </Filter>

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
    </Wrapper>
  );
};
