import React, { FC } from 'react';

import { organizationsService } from '../../src/app/services/auth/organizations/organizations.service';
import { initSyntheticApi } from '../syntheticApi/syntheticApi';
import { ChildrenProps } from '../../src/app/services/models';

import './StoryWrapper.css';

initSyntheticApi();
void organizationsService.loadSettings();

export const StoryWrapper: FC<ChildrenProps> = ({ children }) => <div className='StoryWrapper scroll'>{children}</div>;
