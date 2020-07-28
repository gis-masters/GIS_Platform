import React from 'react';
import { compose } from '@bem-react/core';

import { EditFeatureFieldControl as Presenter } from './EditFeatureField-Control';
import { withTypeUrl } from './_type/EditFeatureField-Control_type_url';
import { withTypeLookup } from './_type/EditFeatureField-Control_type_lookup';

export const EditFeatureFieldControl = compose(
  withTypeUrl,
  withTypeLookup
)(Presenter);
