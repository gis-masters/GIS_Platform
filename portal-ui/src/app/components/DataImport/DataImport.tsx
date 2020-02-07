import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { cn } from '@bem-react/classname';

import { services } from '../../services/services';
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
export class DataImport extends React.Component<{}> {
  private pollTimeout?: number;
  private pollingOn = false;
  private pollingDelay = 500;
  @observable private dialogOpen = false;

  @computed
  private get importUrl (): string {
    return `/projects/${route.params.projectId}/import`;
  }

  @computed
  private get nextUrl (): string {
    return `${this.importUrl}/${route.params.importId}/mapping`;
  }

  constructor (props: {}) {
    super(props);

    this.fileDropHandler = this.fileDropHandler.bind(this);
    this.reset = this.reset.bind(this);
    this.poll = this.poll.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
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

    const { on, file } = currentImport;

    return (
      <div className={cnDataImport()}>
        <DataImportDropzone
            loading={this.loading}
            file={file}
            importOn={on}
            onDrop={this.fileDropHandler}
            onClear={this.reset} />

        <DataImportNotice />

        <DataImportNotifications />

        <DataImportTasksList
            className={cnDataImport('TasksList')}
            onDeleteAllTask={this.reset} />

        <DataImportNavButtons
            onNext={this.handleNext}
            onCancel={this.reset}
            nextUrl={this.nextUrl} />

        <DataImportDialog
            open={this.dialogOpen}
            onClose={this.handleDialogClose}
            nextUrl={this.nextUrl} />
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

  private reset () {
    this.stopPolling();
    currentImport.reset();
    services.ngZone.run(() => {
      services.router.navigate([this.importUrl], { replaceUrl: true });
    });
  }

  private start () {
    services.ngZone.run(async () => {
      const { id } = await services.importService
                                 .initScratchImport(currentImport.file);
      services.router.navigate([`${this.importUrl}/${id}`]);
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

  @action
  private handleNext (e: React.MouseEvent<HTMLButtonElement>) {
    if (currentImport.hasErrorTasks) {
      e.preventDefault();
      this.dialogOpen = true;
    }
  }

  @action
  private handleDialogClose () {
    this.dialogOpen = false;
  }
}
