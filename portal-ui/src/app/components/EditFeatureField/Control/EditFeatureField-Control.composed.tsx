import { compose } from '@bem-react/core';

import { withTypeLookup } from './_type/EditFeatureField-Control_type_lookup';
import { withTypeUrl } from './_type/EditFeatureField-Control_type_url';
import { EditFeatureFieldControl as Presenter } from './EditFeatureField-Control';

export const EditFeatureFieldControl = compose(withTypeUrl, withTypeLookup)(Presenter) as typeof Presenter;
