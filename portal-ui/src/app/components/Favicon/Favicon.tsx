import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import ReactFavicon from 'react-favicon';

import { environment } from '../../services/environment';

const defaultFavicon = '/assets/logo/default/favicon-32x32.png';

export const Favicon: FC = observer(() => <ReactFavicon url={environment.favicon || defaultFavicon} />);
