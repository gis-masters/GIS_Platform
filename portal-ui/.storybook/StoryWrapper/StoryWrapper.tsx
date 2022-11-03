import React, { FC } from 'react';

import { ChildrenProps } from '../../src/app/services/models';
import { initSyntheticApi } from '../syntheticApi/syntheticApi';

import './StoryWrapper.css';

initSyntheticApi();

export const StoryWrapper: FC<ChildrenProps> = ({ children }) => <div className='StoryWrapper scroll'>{children}</div>;
