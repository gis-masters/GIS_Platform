import React, { FC, ReactNode } from 'react';

import { PropertySchema, PropertyType } from '../../../../data/schema/schema.models';
import { AnchorPoint } from '../AnchorPoint/AnchorPoint';
import { AnchorPointX } from '../AnchorPointX/AnchorPointX';
import { AnchorPointY } from '../AnchorPointY/AnchorPointY';
import { Fill } from '../Fill/Fill';
import { Font } from '../Font/Font';
import { Halo } from '../Halo/Halo';
import { Label } from '../Label/Label';
import { LabelPlacement } from '../LabelPlacement/LabelPlacement';
import { OgcFunction } from '../OgcFunction/OgcFunction';
import { OgcLiteral } from '../OgcLiteral/OgcLiteral';
import { OgcPropertyName } from '../OgcPropertyName/OgcPropertyName';
import { PointPlacement } from '../PointPlacement/PointPlacement';
import { Radius } from '../Radius/Radius';
import { SvgParameter } from '../SvgParameter/SvgParameter';
import { TextSymbolizer } from '../TextSymbolizer/TextSymbolizer';
import { VendorOption } from '../VendorOption/VendorOption';

interface LabelProps {
  labelProperty: PropertySchema;
}

export const CustomLabel: FC<LabelProps> = ({ labelProperty }) => {
  let propertyName: ReactNode = <OgcPropertyName>{labelProperty.name}</OgcPropertyName>;

  switch (labelProperty.propertyType) {
    case PropertyType.FLOAT: {
      let precision: string = '#';

      if (labelProperty.precision) {
        precision += '.';

        for (let i = 0; i < labelProperty.precision; i++) {
          precision += '#';
        }
      }

      propertyName = (
        <OgcFunction name='numberFormat'>
          <OgcLiteral>{precision}</OgcLiteral>
          <OgcPropertyName>{labelProperty.name}</OgcPropertyName>
        </OgcFunction>
      );

      break;
    }
    case PropertyType.DATETIME: {
      propertyName = (
        <OgcFunction name='dateFormat'>
          <OgcLiteral>dd.MM.yyyy</OgcLiteral>
          <OgcPropertyName>{labelProperty.name}</OgcPropertyName>
        </OgcFunction>
      );

      break;
    }
  }

  return (
    <TextSymbolizer>
      <Label>{propertyName}</Label>
      <Font>
        <SvgParameter name='font-family'>Arial</SvgParameter>
        <SvgParameter name='font-size'>10</SvgParameter>
        <SvgParameter name='font-style'>normal</SvgParameter>
        <SvgParameter name='font-weight'>bold</SvgParameter>
      </Font>
      <LabelPlacement>
        <PointPlacement>
          <AnchorPoint>
            <AnchorPointX>2.5</AnchorPointX>
            <AnchorPointY>2.5</AnchorPointY>
          </AnchorPoint>
        </PointPlacement>
      </LabelPlacement>
      <Halo>
        <Radius>2</Radius>
        <Fill>
          <SvgParameter name='fill'>#ffffff</SvgParameter>
        </Fill>
      </Halo>
      <Fill>
        <SvgParameter name='fill'>#000000</SvgParameter>
      </Fill>
      <VendorOption name='autoWrap'>150</VendorOption>
      <VendorOption name='maxDisplacement'>150</VendorOption>
    </TextSymbolizer>
  );
};
