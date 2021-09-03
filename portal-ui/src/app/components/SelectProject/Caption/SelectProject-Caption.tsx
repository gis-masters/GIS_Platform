import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/crg/projects.models';

import '!style-loader!css-loader!sass-loader!./SelectProject-Caption.scss';

const cnSelectProjectCaption = cn('SelectProject', 'Caption');

interface SelectOktmoCaptionProps {
  project?: CrgProject;
}

export const SelectProjectCaption: FC<SelectOktmoCaptionProps> = ({ project }) => (
  <span className={cnSelectProjectCaption({ empty: !project })}>{project ? project.name : 'Новый проект'}</span>
);
