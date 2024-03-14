import React, { FC, Fragment } from 'react';

import { PolygonSymbolizer } from '../../PolygonSymbolizer/PolygonSymbolizer';
import { WellKnownName } from '../../WellKnownName/WellKnownName';
import { SvgParameter } from '../../SvgParameter/SvgParameter';
import { GraphicFill } from '../../GraphicFill/GraphicFill';
import { Graphic } from '../../Graphic/Graphic';
import { Stroke } from '../../Stroke/Stroke';
import { Fill } from '../../Fill/Fill';
import { Rule } from '../../Rule/Rule';
import { Mark } from '../../Mark/Mark';
import { Size } from '../../Size/Size';
import { CustomRuleProps } from '../CustomRule';
import { Filter } from '../../Filter/Filter';
import { PropertyIsEqualTo } from '../../PropertyIsEqualTo/PropertyIsEqualTo';
import { Function } from '../../Function/Function';
import { Literal } from '../../Literal/Literal';

export const CustomRuleTypePolygon: FC<CustomRuleProps> = ({ rule, type, bare }) => {
  if (type !== 'polygon') {
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
          <Literal>2</Literal>
        </PropertyIsEqualTo>
      </Filter>

      <PolygonSymbolizer>
        <Fill>
          {rule.fillColor && !rule.fillGraphic && <SvgParameter name='fill'>{rule.fillColor}</SvgParameter>}
          {rule.fillGraphic && (
            <GraphicFill>
              <Graphic>
                <Mark>
                  <WellKnownName>{`shape://${rule.fillGraphic.type}`}</WellKnownName>
                  <Stroke>
                    {rule.fillColor && <SvgParameter name='stroke'>{rule.fillColor}</SvgParameter>}
                    {rule.fillGraphic.strokeWidth && (
                      <SvgParameter name='stroke-width'>{rule.fillGraphic.strokeWidth}</SvgParameter>
                    )}
                  </Stroke>
                </Mark>
                <Size>{rule.fillGraphic.size}</Size>
              </Graphic>
            </GraphicFill>
          )}
        </Fill>
        <Stroke>
          {rule.strokeColor && <SvgParameter name='stroke'>{rule.strokeColor}</SvgParameter>}
          {rule.strokeWidth && <SvgParameter name='stroke-width'>{rule.strokeWidth}</SvgParameter>}
          {rule.strokeDashArray && (
            <SvgParameter name='stroke-dasharray'>{rule.strokeDashArray.join(' ')}</SvgParameter>
          )}
        </Stroke>
      </PolygonSymbolizer>
    </Wrapper>
  );
};
