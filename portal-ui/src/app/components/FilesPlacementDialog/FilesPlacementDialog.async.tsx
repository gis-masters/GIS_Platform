import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Step, StepLabel, Stepper } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { placeFiles } from '../../services/data/file-placement/file-placement.service';
import { FileInfo } from '../../services/data/files/files.models';
import { isTifFile } from '../../services/data/files/files.util';
import { LibraryRecord } from '../../services/data/library/library.models';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { Role } from '../../services/permissions/permissions.models';
import { sleep } from '../../services/util/sleep';
import { allProjects } from '../../stores/AllProjects.store';
import { Button } from '../Button/Button';
import { ChooseXTable } from '../ChooseXTable/ChooseXTable';
import { FilesPlacementDialogReport } from '../FilesPlacementDialogReport/FilesPlacementDialogReport';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { XTableColumn } from '../XTable/XTable.models';
import { FilesPlacementReportStore as FilesPlacementStore } from './FilesPlacementDialog.store';
import { FilesPlacementDialogStepIcon } from './StepIcon/FilesPlacementDialog-StepIcon';

import '!style-loader!css-loader!sass-loader!./FilesPlacementDialog.scss';
import '!style-loader!css-loader!sass-loader!./Card/FilesPlacementDialog-Card.scss';
import '!style-loader!css-loader!sass-loader!./Close/FilesPlacementDialog-Close.scss';
import '!style-loader!css-loader!sass-loader!./Table/FilesPlacementDialog-Table.scss';
import '!style-loader!css-loader!sass-loader!./Stepper/FilesPlacementDialog-Stepper.scss';
import '!style-loader!css-loader!sass-loader!./CrsText/FilesPlacementDialog-CrsText.scss';
import '!style-loader!css-loader!sass-loader!./CrsSelector/FilesPlacementDialog-CrsSelector.scss';

const cnFilesPlacementDialog = cn('FilesPlacementDialog');

interface StepItem {
  title: string;
  prevBtnTitle?: string;
  nextBtnTitle?: string;
  color?: 'primary' | 'inherit';
  last?: boolean;
}

interface DialogFileInfo extends FileInfo {
  field: string;
}

export interface FilesPlacementDialogProps {
  document: LibraryRecord;
  schema: Schema;
  open: boolean;
  onClose(): void;
}

@observer
export default class FilesPlacementDialog extends Component<FilesPlacementDialogProps> {
  private steps: StepItem[] = [
    { title: 'Система координат', nextBtnTitle: 'К выбору файлов', color: 'primary' },
    {
      title: 'Выбор файлов',
      prevBtnTitle: 'К выбору системы координат',
      nextBtnTitle: 'К выбору проекта',
      color: 'primary'
    },
    { title: 'Выбор проекта', prevBtnTitle: 'К выбору файлов', nextBtnTitle: 'Разместить', color: 'primary' },
    { title: 'Результат' }
  ];

  private readonly filesDialogCols: XTableColumn<DialogFileInfo>[] = [
    {
      field: 'title',
      title: 'Название',
      filterable: true
    },
    {
      field: 'field',
      title: 'Поле',
      filterable: true
    }
  ];

  private readonly projectDialogCols: XTableColumn<CrgProject>[] = [
    {
      field: 'name',
      title: 'Название проекта',
      filterable: true
    }
  ];

  private readonly store: FilesPlacementStore = new FilesPlacementStore();

  constructor(props: FilesPlacementDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await projectsService.initAllProjectsStore();
  }

  componentDidUpdate(prevProps: FilesPlacementDialogProps) {
    if (this.props.document.id !== prevProps.document.id) {
      this.resetState();
    }
  }

  render() {
    const { open } = this.props;
    const { activeStep, nextStepDisabled, project, commonProgress } = this.store;

    return (
      <Dialog
        open={open}
        onClose={this.close}
        fullWidth
        maxWidth='md'
        PaperProps={{ className: cnFilesPlacementDialog() }}
      >
        <DialogTitle>Публикация файлов</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel className={cnFilesPlacementDialog('Stepper')}>
            {this.steps.map(stepItem => (
              <Step key={stepItem.title}>
                {/* TODO: странная ошибка типов */}
                <StepLabel StepIconComponent={FilesPlacementDialogStepIcon}>{stepItem.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className={cnFilesPlacementDialog('Card')}>
            {activeStep === 0 && (
              <>
                <div className={cnFilesPlacementDialog('CrsText')}>
                  Система координат будет применена при размещении для всех выбранных на следующем шаге файлов.
                </div>
                <SelectProjection value={this.store.projection} onChange={this.store.setProjection} fullWidth />
              </>
            )}

            {activeStep === 1 && (
              <ChooseXTable<DialogFileInfo>
                className={cnFilesPlacementDialog('Table')}
                data={this.tifFiles}
                selectedItems={this.selectedTifFiles}
                cols={this.filesDialogCols}
                getRowId={this.getFileItemId}
                onSelect={this.onFilesSelected}
                filterable
              />
            )}

            {activeStep === 2 && (
              <ChooseXTable<CrgProject>
                className={cnFilesPlacementDialog('Table')}
                data={this.projects}
                selectedItems={project ? [project] : []}
                cols={this.projectDialogCols}
                getRowId={this.getProjectItemId}
                onSelect={this.onProjectSelected}
                single
                filterable
              />
            )}

            {activeStep === 3 && <FilesPlacementDialogReport store={this.store} />}
          </div>
        </DialogContent>
        <DialogActions>
          {this.steps[activeStep]?.prevBtnTitle && (
            <Button onClick={this.prev} startIcon={<ArrowBack />}>
              {this.steps[activeStep].prevBtnTitle}
            </Button>
          )}
          {this.steps[activeStep]?.nextBtnTitle && (
            <Button
              onClick={this.next}
              disabled={nextStepDisabled}
              color={this.steps[activeStep]?.color}
              endIcon={<ArrowForward />}
            >
              {this.steps[activeStep]?.nextBtnTitle}
            </Button>
          )}

          {activeStep === 3 && (
            <Button href={`/projects/${project.id}/map`} color='primary' disabled={commonProgress}>
              Перейти к проекту
            </Button>
          )}
          <Button className={cnFilesPlacementDialog('Close')} onClick={this.close}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get tifFiles(): DialogFileInfo[] {
    const { schema, document } = this.props;
    if (!schema) {
      return [];
    }

    const result: DialogFileInfo[] = [];
    schema.properties
      .filter(prop => prop.propertyType === PropertyType.FILE)
      .forEach(prop => {
        const files = document[prop.name] as FileInfo[];
        if (files && files.length) {
          const data: DialogFileInfo[] = files.filter(isTifFile).map(file => {
            return {
              id: file.id,
              title: file.title,
              size: file.size,
              notLoaded: file.notLoaded,
              field: prop.title
            };
          });

          result.push(...data);
        }
      });

    return result;
  }

  @computed
  private get selectedTifFiles(): DialogFileInfo[] {
    return this.tifFiles.filter(tifFile => this.store.files.some(({ id }) => tifFile.id === id));
  }

  @computed
  private get projects(): CrgProject[] {
    return allProjects.list.filter(({ role }) => role === Role.OWNER);
  }

  @boundMethod
  private onProjectSelected([project]: CrgProject[]) {
    this.store.setProject(project);
  }

  @boundMethod
  private onFilesSelected(files: FileInfo[]) {
    this.store.setFiles(files);
  }

  @boundMethod
  private async close() {
    this.props.onClose();

    await sleep(400);

    this.resetState();
  }

  @boundMethod
  private async next() {
    this.store.nextStep();

    if (this.store.activeStep === 3) {
      await this.place();
    }
  }

  private async place() {
    const { document } = this.props;
    const { files, projection, project, tasks } = this.store;
    const apiActions = placeFiles(files, getProjectionCode(projection), project, document);

    this.store.initTasks(document);

    apiActions.forEach(async (apiAction, i) => {
      try {
        await apiAction;
        this.store.completeTask(tasks[i].id);
      } catch {
        this.store.errorTask(tasks[i].id);
      }
    });

    await Promise.allSettled(apiActions);
    this.store.setCommonProgress(false);

    communicationService.fileConnectionsUpdated.emit({ type: 'create', data: files });
  }

  @boundMethod
  private prev() {
    this.store.prevStep();
  }

  private resetState() {
    this.store.setStep(0);
    this.store.setFiles([]);
    this.store.setProjection();
    this.store.setProject();

    this.store.clear();
  }

  private getFileItemId({ id }: FileInfo): string {
    return String(id);
  }

  private getProjectItemId({ id }: CrgProject): string {
    return String(id);
  }
}
