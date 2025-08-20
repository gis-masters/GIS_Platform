import React, { FC, Fragment } from 'react';

import { LABEL_PROPERTY_DEFAULT } from '../../../styles.models';
import { CustomLabel } from '../../CustomLabel/CustomLabel';
import { Filter } from '../../Filter/Filter';
import { Function } from '../../Function/Function';
import { LineSymbolizer } from '../../LineSymbolizer/LineSymbolizer';
import { Literal } from '../../Literal/Literal';
import { PropertyIsEqualTo } from '../../PropertyIsEqualTo/PropertyIsEqualTo';
import { Rule } from '../../Rule/Rule';
import { Stroke } from '../../Stroke/Stroke';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { CustomRuleProps } from '../CustomRule';

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

      {rule.labelProperty && rule.labelProperty !== LABEL_PROPERTY_DEFAULT && (
        <CustomLabel labelProperty={rule.labelProperty} />
      )}
    </Wrapper>
  );
};
