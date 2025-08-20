import React, { FC, lazy, Suspense } from 'react';

import { ProjectFolderContentProps } from './ProjectFolderContent.async';

const ProjectFolderContentAsync = lazy(() => import('./ProjectFolderContent.async'));

export const ProjectFolderContent: FC<ProjectFolderContentProps> = props => (
  <Suspense>
    <ProjectFolderContentAsync {...props} />
  </Suspense>
);
