import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { currentImport } from '../../stores/CurrentImport.store';

import { DataImportTasksListTask } from './Task/DataImportTasksList-Task';

import '!style-loader!css-loader!sass-loader!./DataImportTasksList.scss';

const cnDataImportTasksList = cn('DataImportTasksList');

interface DataImportTasksListProps {
  onDeleteAllTask?: () => void;
  short?: boolean;
  onlyErrors?: boolean;
  className?: string;
}

@observer
export class DataImportTasksList extends Component<DataImportTasksListProps> {
  private progressTimeout: number;

  componentWillUnmount() {
    window.clearTimeout(this.progressTimeout);
  }

  render() {
    const tasks = this.props.onlyErrors ? currentImport.errorTasks : currentImport.tasks;

    return (
      <div className={cnDataImportTasksList(null, [this.props.className])}>
        <table className={cnDataImportTasksList('Table')}>
          <tbody>
            {tasks.map(task => (
              <DataImportTasksListTask
                task={task}
                key={task.id}
                onDeleteTask={this.onDeleteTask}
                short={this.props.short}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  @boundMethod
  private onDeleteTask() {
    if (!currentImport.tasks.length) {
      this.props.onDeleteAllTask();
    }
  }
}
