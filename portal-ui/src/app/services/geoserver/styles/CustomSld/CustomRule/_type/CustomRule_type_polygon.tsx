import React, { FC } from 'react';

import { CustomStyleDescription } from '../../../styles.models';

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

export const CustomRuleTypePolygon: FC<CustomStyleDescription> = ({ rule, type }) => {
  if (type !== 'polygon') {
    throw new Error('Ошибка: некорректный тип стиля');
  }

  return (
    <Rule>
      <PolygonSymbolizer>
        <Fill>
          {rule.fillColor && <SvgParameter name='fill'>{rule.fillColor}</SvgParameter>}
          {rule.fillGraphic && (
            <GraphicFill>
              <Graphic>
                <Mark>
                  <WellKnownName>{rule.fillGraphic.type}</WellKnownName>
                  <Stroke>
                    {rule.fillGraphic.strokeColor && (
                      <SvgParameter name='stroke'>{rule.fillGraphic.strokeColor}</SvgParameter>
                    )}
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
    </Rule>
  );
};
