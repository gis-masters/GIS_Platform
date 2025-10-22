import React, { type FC, lazy, Suspense } from 'react';

import { type ProjectFolderContentProps } from './ProjectFolderContent.chunkroot';

const ProjectFolderContentAsync = lazy(() => import('./ProjectFolderContent.chunkroot'));

export const ProjectFolderContent: FC<ProjectFolderContentProps> = props => (
  <Suspense>
    <ProjectFolderContentAsync {...props} />
  </Suspense>
);
