import * as React from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import { cn } from '@bem-react/classname';

import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { currentImport } from '../../stores/CurrentImport.store';
import { Project } from '../../services/crg/projects.service';
import { Button } from '../Button/Button';
import { DataImportTasksList } from '../DataImportTasksList/DataImportTasksList';

import { DataImportDropzone } from './Dropzone/DataImport-Dropzone';
import { DataImportNotice } from './Notice/DataImport-Notice';
import { DataImportNotifications } from './Notifications/DataImport-Notifications';

import '!style-loader!css-loader!sass-loader!./DataImport.scss';

const cnDataImport = cn('DataImport');

@observer
export class DataImport extends React.Component<{}> {
  private pollTimeout?: number;
  private pollingOn = false;
  private pollingDelay = 500;

  constructor (props: {}) {
    super(props);

    this.fileDropHandler = this.fileDropHandler.bind(this);
    this.reset = this.reset.bind(this);
    this.poll = this.poll.bind(this);
  }

  async componentDidMount () {
    await services.provided;

    const urlImportId = route.params.importId;
    const { importService } = services;

    if (urlImportId) {
      if (currentImport.id && currentImport.id !== urlImportId) {
        this.reset();
      }

      try {
        await importService.fetchCurrentImport(urlImportId);
        this.launchPolling();
      } catch (err) {
        this.reset();
      }
    } else {
      if (currentImport.id) {
        this.reset();
      }
    }
  }

  componentWillUnmount () {
    this.stopPolling();
  }

  render () {
    if (!route.params) {
      return null;
    }

    const { isSuccess, on, file, isWrongExt, isError } = currentImport;
    const { projectId, importId } = route.params;
    const nextUrl = `/project/${projectId}/import/${importId}/mapping`;

    return (
      <div className={cnDataImport()}>
        <DataImportDropzone
            loading={this.loading}
            file={file}
            importOn={on}
            onDrop={this.fileDropHandler}
            onClear={this.reset} />

        <DataImportNotice />

        <DataImportNotifications
            isWrongExt={isWrongExt}
            isImportFailed={isError}
            isSuccess={isSuccess} />

        <DataImportTasksList className={cnDataImport('TasksList')} />

        <div className={cnDataImport('NavButtons')}>

          {on ? (
              <Button onClick={this.reset} variant='outlined'>
                Отменить импорт
              </Button>
            ) : (
              <Button routerLink='/projects' variant='outlined'>
                Вернуться к выбору проекта
              </Button>
            )}
          <Button disabled={!isSuccess}  routerLink={nextUrl} variant='outlined' color='primary'>
            Далее
          </Button>
        </div>
      </div>
    );
  }

  @computed
  private get loading (): boolean {
    const { file, id, isError, isFinished } = currentImport;
    return Boolean(file || id) && !isError && !isFinished;
  }

  @action
  private fileDropHandler (files: File[]) {
    if (files.length) {
      currentImport.file = files[0];
      if (!currentImport.isWrongExt) {
        this.start();
      }
    }
  }

  private async reset () {
    this.stopPolling();
    currentImport.reset();
    const currentProject: Project = await services.projectsService.getCurrent();
    services.ngZone.run(() => {
      services.router.navigate(
          [`/project/${currentProject.id}/import`],
          { replaceUrl: true }
      );
    });
  }

  private start () {
    services.ngZone.run(async () => {
      const currentProject: Project = await services.projectsService.getCurrent();
      const { id } = await services.importService
                                 .initScratchImport(currentImport.file);
      services.router.navigate([`/project/${currentProject.id}/import/${id}`]);
      this.launchPolling();
    });
  }

  private launchPolling () {
    this.pollingOn = true;
    this.poll();
  }

  private async poll () {
    const { importService } = services;

    if (currentImport.isFinished) {
      this.stopPolling();
    }

    if (!this.pollingOn) {
      return;
    }

    await Promise.all([importService.checkImportStatus(), importService.updateProgress()]);

    if (this.pollingOn) {
      this.pollTimeout = window.setTimeout(this.poll, this.pollingDelay);
    }
  }

  private stopPolling() {
    this.pollingOn = false;
    clearTimeout(this.pollTimeout);
  }
}
