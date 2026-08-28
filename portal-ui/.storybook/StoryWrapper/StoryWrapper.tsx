import React, { type FC } from 'react';

import { organizationsService } from '../../src/app/services/auth/organizations/organizations.service';
import { type ChildrenProps } from '../../src/app/services/models';
import { initStorybookServices } from '../storybookServices';
import { initSyntheticApi } from '../syntheticApi/syntheticApi';

import './StoryWrapper.css';

initSyntheticApi();
initStorybookServices();
void organizationsService.loadSettings();

export const StoryWrapper: FC<ChildrenProps> = ({ children }) => <div className='StoryWrapper scroll'>{children}</div>;
