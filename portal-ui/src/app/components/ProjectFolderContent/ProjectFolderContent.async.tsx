import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { isEqual } from 'lodash';

import { CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { permissionsClient } from '../../services/permissions/permissions.client';
import { Role } from '../../services/permissions/permissions.models';
import { formatDate } from '../../services/util/date.util';
import { currentUser } from '../../stores/CurrentUser.store';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import { crgProjectFolderSchema } from '../ProjectActions/ProjectActions';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./ProjectFolderContent.scss';

const cnProjectFolderContent = cn('ProjectFolderContent');

export const projectsRootUrlItems = ['r', 'root', 'pr', 'projectsRoot'];

export interface ProjectFolderContentProps extends IClassNameProps {
  project: CrgProject;
}

const ProjectFolderContent: FC<ProjectFolderContentProps> = observer(props => {
  const { project, className } = props;
  const [url, setUrl] = useState<string>();
  const [breadcrumbsItems, setBreadcrumbsItems] = useState<BreadcrumbsItemData[]>([]);

  const getCrgProjectBreadcrumbs = async (item: CrgProject): Promise<BreadcrumbsItemData[]> => {
    const { path = null, name, id } = item;
    const projectsRootPath = JSON.stringify([...projectsRootUrlItems, 'none', 'none']);

    const breadcrumbs = [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Проекты',
        url: `/data-management?path_dm=${projectsRootPath}`
      }
    ];

    if (path) {
      const pathParts = path.split('/');
      pathParts.shift();
      const currentPath = [...projectsRootUrlItems];

      for (const identifier of pathParts) {
        try {
          const projectFolder = await projectsService.getById(Number(identifier));

          if (projectFolder) {
            currentPath.push('prf', identifier);

            breadcrumbs.push({
              title: projectFolder.name,
              url: `/data-management?path_dm=${JSON.stringify([...currentPath, 'none', 'none'])}`
            });
          }
        } catch (error) {
          console.error(`Error fetching project folder ${identifier}:`, error);
        }
      }

      currentPath.push('prf', String(id));
      breadcrumbs.push({
        title: name,
        url: `/data-management?path_dm=${JSON.stringify([...currentPath, 'none', 'none'])}`
      });
    }

    return breadcrumbs;
  };

  useEffect(() => {
    const getBreadcrumbsItems = async () => {
      const breadcrumbs = await getCrgProjectBreadcrumbs(project);
      setBreadcrumbsItems(breadcrumbs);
    };

    if (project) {
      void getBreadcrumbsItems();
      setUrl(permissionsClient.getProjectPermissionsUrl(project.id));
    }

    if (!isEqual(props.project, project)) {
      void getBreadcrumbsItems();
    }
  }, [project, props.project]);

  return (
    <div className={cnProjectFolderContent(null, [className])}>
      <Breadcrumbs className={cnProjectFolderContent('Breadcrumbs')} itemsType='link' items={breadcrumbsItems} />

      <div className={cnProjectFolderContent('projectCard')}>
        <ViewContentWidget
          formRole='viewProject'
          schema={crgProjectFolderSchema}
          data={project}
          title='Карточка папки проекта'
        />
      </div>

      <div className={cnProjectFolderContent('Date')}>
        <span className={cnProjectFolderContent('DateTitle')}>Дата создания:</span>
        {project.createdAt && formatDate(project.createdAt, 'LL')}
      </div>

      {url && (
        <PermissionsWidget
          url={url}
          title={project.name}
          itemEntityType={ExplorerItemEntityTypeTitle.PROJECT}
          disabled={!(currentUser.isAdmin || project.role === Role.OWNER)}
        />
      )}
    </div>
  );
});

export default ProjectFolderContent;
