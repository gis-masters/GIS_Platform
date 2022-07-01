import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import {
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  SelectChangeEvent,
  DialogActions,
  DialogTitle
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

import { sleep } from '../../services/util/sleep';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { XTableColumn } from '../XTable/XTable';
import { ChooseXTable } from '../ChooseXTable/ChooseXTable';
import { allProjects } from '../../stores/AllProjects.store';
import { Role } from '../../services/crg/permissions.models';
import { CrgProject } from '../../services/crg/projects.models';
import { placeFiles } from '../../services/files-placement.service';
import { FileInfo } from '../../services/files.service';
import { isTifFile } from '../../services/files.util';
import { projectsService } from '../../services/crg/projects.service';
import { LibraryRecord } from '../../services/crg/doc-library.service';
import { PropertyType, Schema } from '../../services/crg/schema.models';
import { viewedProjections } from '../../services/geoserver/projections.service';
import { FilesPlacementDialogReport } from '../FilesPlacementDialogReport/FilesPlacementDialogReport';
import { communicationService } from '../../services/communication.service';

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

interface FilesPlacementDialogProps {
  document: LibraryRecord;
  schema: Schema<LibraryRecord>;
  open: boolean;
  onClose(): void;
}

@observer
export class FilesPlacementDialog extends Component<FilesPlacementDialogProps> {
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
    const { activeStep, nextStepDisabled, crs, project, commonProgress } = this.store;

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
                <Select
                  className={cnFilesPlacementDialog('CrsSelector')}
                  label='Система координат'
                  options={viewedProjections.map(proj => ({ value: proj.id, children: proj.title }))}
                  onChange={this.handleCrsChange}
                  value={crs}
                />
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
  private handleCrsChange(e: SelectChangeEvent) {
    this.store.setCrs(e.target.value);
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
    const { files, crs, project, tasks } = this.store;
    const apiActions = placeFiles(files, crs, project, document);

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

    communicationService.updateFileConnections.emit(files);
  }

  @boundMethod
  private prev() {
    this.store.prevStep();
  }

  private resetState() {
    const { document } = this.props;

    this.store.setStep(0);
    this.store.setFiles([]);
    this.store.setCrs(document.native_crs || '');
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
