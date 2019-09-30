import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { cn } from '@bem-react/classname';


import {services} from '../../services/services';
import {ImportTaskProgress, ImportTaskShort, ImportTaskFull} from '../../services/geoserver/import/models';
import {NameHrefProjection} from '../../services/geoserver/projections';

const cnDataImportTasksList = cn('DataImportTasksList');

interface Task extends ImportTaskShort {
  layer?: NameHrefProjection;
}

interface DataImportTasksListProps {
  tasks: ImportTaskShort[];
  importState?: string;
}

@observer
export class DataImportTasksList extends React.Component<DataImportTasksListProps> {
  @observable
  private tasks: Task[] = [];

  @observable
  private progress?: ImportTaskProgress;

  private progressTimeout: number;

  constructor(props: DataImportTasksListProps) {
    super(props);

    this.setTasks(props.tasks);
  }

  componentDidMount () {
    this.updateTasks();
  }

  componentDidUpdate () {
    this.setTasks(this.props.tasks);

    if (['COMPLETE', 'ERROR'].includes(this.props.importState)) {
      this.setProgress();
      window.clearTimeout(this.progressTimeout);
    }
  }

  componentWillUnmount () {
    window.clearTimeout(this.progressTimeout);
  }

  render() {
    const { tasks } = this;

    return (
      <table className={cnDataImportTasksList()}>
        <tbody>
          {tasks.map(task => {
            const { layer } = task;
            const progress = task.state === 'RUNNING' && this.progress;

            return (
              <tr className={cnDataImportTasksList('Task', {error: this.isError(task)})} key={task.id}>
                <td className={cnDataImportTasksList('TaskName')}>
                  {layer ? layer.name : ''}
                </td>
                <td className={cnDataImportTasksList('TaskStatus')}>
                  {this.getDescription(task)}
                </td>
                <td className={cnDataImportTasksList('TaskProgress')}>
                  {progress ? progress.progress : '\u00A0'}
                  {progress && progress.total ? ` / ${progress.total}` : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  @action
  private setTasks (tasks: Task[]) {
    tasks.forEach((task, i) => {
      const oldTask = this.tasks.find((t) => t.id === task.id);
      if (oldTask) {
        this.tasks[this.tasks.indexOf(oldTask)] = Object.assign(oldTask, task);
      } else {
        this.tasks.push(task);
      }
    });
  }

  private async updateTasks() {
    const tasks = await Promise.all(
      this.tasks.map(task => services.importService.getFullImportTask(task))
    );

    this.setTasks(tasks);

    this.checkProgress();
  }

  private async checkProgress () {
    const progress = await services.importService.getImportTaskProgress(this.tasks[0] as ImportTaskFull);

    if (progress.state === 'COMPLETE') {
      this.setProgress();
    } else {
      this.setProgress(progress);
    }

    if (!['COMPLETE', 'ERROR'].includes(this.props.importState)) {
      this.progressTimeout = window.setTimeout(() => {
        this.checkProgress();
      }, 300);
    }
  }

  @action
  setProgress (progress?: ImportTaskProgress) {
    this.progress = progress;
  }

  private isError(task: Task): boolean {
    return services.importService.isTaskError(task);
  }

  private getDescription(task: Task): string {
    const {state} = task;
    const {taskStatusesList} = services.importService;
    if (Object.keys(taskStatusesList).includes(state)) {
      return taskStatusesList[state];
    } else {
      return 'Неопределенный статус';
    }
  }
}
