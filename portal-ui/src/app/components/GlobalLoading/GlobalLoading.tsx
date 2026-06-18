import React, { type FC } from 'react';
import { observer } from 'mobx-react';

import { globalLoadingStore } from '../../stores/GlobalLoading.store';
import { Loading } from '../Loading/Loading';

export const GlobalLoading: FC = observer(() => <Loading global visible={globalLoadingStore.visible} />);
