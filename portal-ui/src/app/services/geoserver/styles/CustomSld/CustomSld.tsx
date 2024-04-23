import React, { FC } from 'react';

import { CustomStyleDescription } from '../styles.models';
import { CustomRule } from './CustomRule/CustomRule';
import { FeatureTypeStyle } from './FeatureTypeStyle/FeatureTypeStyle';
import { Name } from './Name/Name';
import { NamedLayer } from './NamedLayer/NamedLayer';
import { StyledLayerDescriptor } from './StyledLayerDescriptor/StyledLayerDescriptor';
import { UserStyle } from './UserStyle/UserStyle';

interface CustomSldProps {
  layerComplexName: string;
  style: CustomStyleDescription;
}

export const CustomSld: FC<CustomSldProps> = ({ layerComplexName, style }) => (
  <StyledLayerDescriptor>
    <NamedLayer>
      <Name>{layerComplexName}</Name>
      <UserStyle>
        <FeatureTypeStyle>
          <CustomRule {...style} />
        </FeatureTypeStyle>
      </UserStyle>
    </NamedLayer>
  </StyledLayerDescriptor>
);
