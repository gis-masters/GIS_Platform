import React, { FC } from 'react';

import { CustomStyleDescription } from '../styles.models';

import { StyledLayerDescriptor } from './StyledLayerDescriptor/StyledLayerDescriptor';
import { FeatureTypeStyle } from './FeatureTypeStyle/FeatureTypeStyle';
import { NamedLayer } from './NamedLayer/NamedLayer';
import { UserStyle } from './UserStyle/UserStyle';
import { Name } from './Name/Name';
import { CustomRule } from './CustomRule/CustomRule';

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
