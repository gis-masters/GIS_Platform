import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action, makeObservable } from 'mobx';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';
import {
  fetchCurrentImport,
  initScratchImport,
  checkImportStatus,
  updateProgress
} from '../../services/geoserver/import/import.service';
import { projectsService } from '../../services/gis/projects.service';
import { schemaService } from '../../services/data/schema.service';
import { route } from '../../stores/Route.store';
import { currentImport } from '../../stores/CurrentImport.store';
import { DataImportTasksList } from '../DataImportTasksList/DataImportTasksList';

import { DataImportDropzone } from './Dropzone/DataImport-Dropzone';
import { DataImportNotice } from './Notice/DataImport-Notice';
import { DataImportNotifications } from './Notifications/DataImport-Notifications';
import { DataImportNavButtons } from './NavButtons/DataImport-NavButtons';
import { DataImportDialog } from './Dialog/DataImport-Dialog';

import '!style-loader!css-loader!sass-loader!./DataImport.scss';

const cnDataImport = cn('DataImport');

@observer
export default class DataImport extends Component {
  private pollTimeout?: number;
  private pollingOn = false;
  private pollingDelay = 500;
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get importUrl(): string {
    return `/projects/${route.params.projectId}/import`;
  }

  @computed
  private get nextUrl(): string {
    return `${this.importUrl}/${route.params.importId}/mapping`;
  }

  async componentDidMount() {
    // прогреем схемы, понадобятся на следующем шаге
    void schemaService.getAllOldSchemas();
    const urlImportId = route.params.importId;

    if (urlImportId) {
      if (currentImport.id && currentImport.id !== urlImportId) {
        this.reset();
      }

      try {
        await fetchCurrentImport(urlImportId);
        this.startPolling();
      } catch {
        this.reset();
      }
    } else if (currentImport.id) {
      this.reset();
    }

    await projectsService.fetchCurrent();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  render() {
    if (!route.params) {
      return null;
    }

    const { on, file } = currentImport;

    return (
      <div className={cnDataImport()}>
        <DataImportDropzone
          loading={this.loading}
          file={file}
          importOn={on}
          onDrop={this.fileDropHandler}
          onClear={this.reset}
        />

        <DataImportNotice />

        <DataImportNotifications />

        <DataImportTasksList className={cnDataImport('TasksList')} onDeleteAllTask={this.reset} />

        <DataImportNavButtons onNext={this.handleNext} onCancel={this.reset} nextUrl={this.nextUrl} />

        <DataImportDialog open={this.dialogOpen} onClose={this.handleDialogClose} nextUrl={this.nextUrl} />
      </div>
    );
  }

  @computed
  private get loading(): boolean {
    const { file, id, isError, isFinished } = currentImport;

    return Boolean(file || id) && !isError && !isFinished;
  }

  @action.bound
  private fileDropHandler(files: File[]) {
    if (files.length) {
      currentImport.file = files[0];
      if (!currentImport.isWrongExt) {
        this.start();
      }
    }
  }

  @boundMethod
  private reset() {
    this.stopPolling();
    currentImport.reset();
    void services.ngZone.run(async () => {
      await services.router.navigate([this.importUrl], { replaceUrl: true });
    });
  }

  private start() {
    void services.ngZone.run(async () => {
      const { id } = await initScratchImport(currentImport.file);
      if (currentImport.file) {
        // if was not reset
        await services.router.navigate([`${this.importUrl}/${id}`]);
        this.startPolling();
      }
    });
  }

  private startPolling() {
    this.pollingOn = true;
    void this.poll();
  }

  @boundMethod
  private async poll() {
    if (currentImport.isFinished) {
      this.stopPolling();
    }

    if (!this.pollingOn) {
      return;
    }

    await Promise.all([checkImportStatus(), updateProgress()]);

    if (this.pollingOn) {
      this.pollTimeout = window.setTimeout(this.poll, this.pollingDelay);
    }
  }

  private stopPolling() {
    this.pollingOn = false;
    clearTimeout(this.pollTimeout);
  }

  @action.bound
  private handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    if (currentImport.hasErrorTasks) {
      e.preventDefault();
      this.dialogOpen = true;
    }
  }

  @action.bound
  private handleDialogClose() {
    this.dialogOpen = false;
  }
}
