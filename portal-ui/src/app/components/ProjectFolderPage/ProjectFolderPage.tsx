import React, { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { Link } from '../Link/Link';
import { Loading } from '../Loading/Loading';
import { ProjectActions } from '../ProjectActions/ProjectActions';
import { ProjectFolderContent } from '../ProjectFolderContent/ProjectFolderContent';
import { TextBadge } from '../TextBadge/TextBadge';

import '!style-loader!css-loader!sass-loader!./ProjectFolderPage.scss';

const cnProjectFolderPageContainer = cn('ProjectFolderPageContainer');

export const ProjectFolderPage: FC = observer(() => {
  const [project, setProject] = useState<CrgProject>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const operationId = useRef<symbol>();

  const init = async () => {
    setBusy(true);
    await fetchProject();
    setBusy(false);
  };

  const fetchProject = async () => {
    const projectId = Number(route.params.projectId);

    const currentOperationId = Symbol();
    operationId.current = currentOperationId;

    try {
      const fetchedProject = await projectsService.getById(projectId);

      if (operationId.current !== currentOperationId) {
        return;
      }

      if (fetchedProject) {
        setProject(fetchedProject);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setBusy(false);

      setError(err?.response?.data?.message || err?.message || 'Не удалось открыть проект');

      services.logger.error('Не удалось открыть проект: ', err.message);
    }
  };

  useEffect(() => {
    void init();

    communicationService.projectUpdated.on(init);

    return () => {
      communicationService.off(init);
    };
  }, []);

  const TypeIcon = project?.folder ? FolderOutlined : InsertDriveFileOutlined;

  return (
    <div className={cnProjectFolderPageContainer()}>
      {!error && project && (
        <>
          <h1 className={cnProjectFolderPageContainer('Title')}>
            <TypeIcon color='primary' className={cnProjectFolderPageContainer('TypeIcon')} />
            {project.name}
            {project.id && <TextBadge id={project.id} className={cnProjectFolderPageContainer('Id')} />}
          </h1>
          <ProjectFolderContent project={project} />
          <ProjectActions className={cnProjectFolderPageContainer('Actions')} project={project} as='button' />
        </>
      )}

      {error && (
        <EmptyListView text={error}>
          <Link href={'/data-management'}>На страницу управления данными</Link>
        </EmptyListView>
      )}

      <Loading visible={busy} />
    </div>
  );
});
