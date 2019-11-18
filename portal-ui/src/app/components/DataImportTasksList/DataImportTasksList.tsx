import * as React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentImport } from '../../stores/CurrentImport.store';

import { DataImportTasksListTask } from './Task/DataImportTasksList-Task';

import '!style-loader!css-loader!sass-loader!./DataImportTasksList.scss';

const cnDataImportTasksList = cn('DataImportTasksList');

interface DataImportTasksListProps {
  onDeleteAllTask: () => void;
  className?: string;
}

@observer
export class DataImportTasksList extends React.Component<DataImportTasksListProps> {
  private progressTimeout: number;
  private ismounted = false;

  constructor (props: DataImportTasksListProps) {
    super(props);

    this.onDeleteTask = this.onDeleteTask.bind(this);
  }

  componentDidMount () {
    this.ismounted = true;
  }

  componentWillUnmount () {
    this.ismounted = false;
    window.clearTimeout(this.progressTimeout);
  }

  render() {
    return (
      <div className={cnDataImportTasksList(null, [this.props.className])}>
        <table className={cnDataImportTasksList('Table')}>
          <tbody>
            {currentImport.tasks.map(task => (
              <DataImportTasksListTask task={task} key={task.id} onDeleteTask={this.onDeleteTask} />)
            )}
          </tbody>
        </table>
      </div>
    );
  }

  private onDeleteTask () {
    if (!currentImport.tasks.length) {
      this.props.onDeleteAllTask();
    }
  }
}
