import React, { FC } from 'react';

import { AnchorPoint } from '../AnchorPoint/AnchorPoint';
import { AnchorPointX } from '../AnchorPointX/AnchorPointX';
import { AnchorPointY } from '../AnchorPointY/AnchorPointY';
import { Fill } from '../Fill/Fill';
import { Font } from '../Font/Font';
import { Halo } from '../Halo/Halo';
import { Label } from '../Label/Label';
import { LabelPlacement } from '../LabelPlacement/LabelPlacement';
import { OgcPropertyName } from '../OgcPropertyName/OgcPropertyName';
import { PointPlacement } from '../PointPlacement/PointPlacement';
import { Radius } from '../Radius/Radius';
import { SvgParameter } from '../SvgParameter/SvgParameter';
import { TextSymbolizer } from '../TextSymbolizer/TextSymbolizer';
import { VendorOption } from '../VendorOption/VendorOption';

interface LabelProps {
  propertyName: string;
}

export const CustomLabel: FC<LabelProps> = ({ propertyName }) => {
  return (
    <TextSymbolizer>
      <Label>
        <OgcPropertyName>{propertyName}</OgcPropertyName>
      </Label>
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
