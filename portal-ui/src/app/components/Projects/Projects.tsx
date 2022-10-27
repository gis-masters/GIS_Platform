import React, { FC, lazy, Suspense } from 'react';

const ProjectsAsync = lazy(() => import('./Projects.async'));

export const Projects: FC = props => (
  <Suspense>
    <ProjectsAsync {...props} />
  </Suspense>
);
