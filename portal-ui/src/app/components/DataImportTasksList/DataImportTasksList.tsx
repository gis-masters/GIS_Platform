import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { currentImport } from '../../stores/CurrentImport.store';
import { DataImportTasksListTask } from './Task/DataImportTasksList-Task';

import '!style-loader!css-loader!sass-loader!./DataImportTasksList.scss';

const cnDataImportTasksList = cn('DataImportTasksList');

interface DataImportTasksListProps {
  short?: boolean;
  onlyErrors?: boolean;
  className?: string;
  onDeleteAllTask?(): void;
}

@observer
export class DataImportTasksList extends Component<DataImportTasksListProps> {
  private progressTimeout?: number;

  componentWillUnmount() {
    window.clearTimeout(this.progressTimeout);
  }

  render() {
    const { short = false, onlyErrors, className } = this.props;
    const tasks = onlyErrors ? currentImport.errorTasks : currentImport.tasks;

    return (
      <div className={cnDataImportTasksList(null, [className])}>
        <table className={cnDataImportTasksList('Table')}>
          <tbody>
            {tasks.map(task => (
              <DataImportTasksListTask task={task} key={task.id} onDeleteTask={this.onDeleteTask} short={short} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  @boundMethod
  private onDeleteTask() {
    if (!currentImport.tasks.length) {
      this.props.onDeleteAllTask?.();
    }
  }
}
