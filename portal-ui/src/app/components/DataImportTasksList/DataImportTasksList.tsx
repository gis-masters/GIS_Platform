import * as React from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentImport } from '../../stores/CurrentImport.store';

import '!style-loader!css-loader!sass-loader!./DataImportTasksList.scss';

const cnDataImportTasksList = cn('DataImportTasksList');

interface DataImportTasksListProps {
  className?: string;
}

@observer
export class DataImportTasksList extends React.Component<DataImportTasksListProps> {
  private progressTimeout: number;

  private ismounted = false;

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
            {currentImport.tasks.map(({ id, statusText, layer, state, isError }) => {
              const progress = state === 'RUNNING' && currentImport.progress;

              return (
                <tr className={cnDataImportTasksList('Task', {error: isError})} key={id}>
                  <td className={cnDataImportTasksList('TaskName')}>
                    {layer ? layer.name : ''}
                  </td>
                  <td className={cnDataImportTasksList('TaskStatus')}>
                    {statusText}
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
      </div>
    );
  }
}
