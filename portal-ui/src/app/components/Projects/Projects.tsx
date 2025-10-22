import React, { type FC, lazy, Suspense } from 'react';

const ProjectsAsync = lazy(() => import('./Projects.chunkroot'));

export const Projects: FC = props => (
  <Suspense>
    <ProjectsAsync {...props} />
  </Suspense>
);
