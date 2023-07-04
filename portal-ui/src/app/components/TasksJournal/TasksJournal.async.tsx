import React, { Component, ReactElement } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Subject } from 'rxjs';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { HomeOutlined } from '@mui/icons-material';
import { cloneDeep } from 'lodash';

import { FilterQuery, getFieldFilterValue, modifyFieldFilterValue } from '../../services/util/filterObjects';
import { LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { registryDefaultFilter } from '../DataManagement/DataManagement.utils';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';
import { communicationService } from '../../services/communication.service';
import { TasksJournalSettings } from './Settings/TasksJournal-Settings';
import { calculateValues } from '../../services/formValidation.service';
import { Task, taskSchema } from '../../services/data/task/task.models';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { getTasks } from '../../services/data/task/task.service';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { currentUser } from '../../stores/CurrentUser.store';
import { PageOptions, ValueOf } from '../../services/models';
import { SortParams } from '../../services/util/sortObjects';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { sleep } from '../../services/util/sleep';
import { Registry } from '../Registry/Registry';
import { XTableProps } from '../XTable/XTable';

import { TasksJournalActions } from '../TasksJournalActions/TasksJournalActions';
import { TaskStatusIcon } from '../TaskStatusIcon/TaskStatusIcon';
import { TasksJournalCreate } from './Create/TasksJournal-Create';
import { convertToComplexField } from '../Form/Form.utils';

import '!style-loader!css-loader!sass-loader!./TasksJournal.scss';

const cnTasksJournal = cn('TasksJournal');

export interface TasksJournalProps {
  id: string;
  onSelect?: (items: LibraryRecord[]) => void;
}

@observer
export default class TasksJournal extends Component<TasksJournalProps> {
  @observable private hiddenFields: string[] = [];
  private defaultSort: SortParams<Task> = { field: 'ownerId', asc: true };
  private defaultFilter: FilterQuery = registryDefaultFilter;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private tableInvoke: XTableProps<Task>['invoke'] = {};

  constructor(props: TasksJournalProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    communicationService.taskUpdated.on(async () => {
      if (this.tableInvoke && this.tableInvoke.reload) {
        await this.tableInvoke.reload();
      }
    });

    await this.restoreSettings();
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    communicationService.off(this);
  }

  render() {
    return (
      <div className={cnTasksJournal()}>
        {organizationSettings.taskManagement && (
          <>
            <Breadcrumbs
              items={[
                { title: <HomeOutlined />, url: '/data-management' },
                { title: 'Задачи', url: '/data-management' }
              ]}
              itemsType='link'
              size='medium'
            />

            <Registry<Task>
              className={cnTasksJournal('Table')}
              cols={this.cols}
              id={'tasksJournal'}
              getData={this.getData}
              defaultSort={this.defaultSort}
              secondarySortField='id'
              filtersAlwaysEnabled
              showFiltersPanel
              urlChangeEnabled
              defaultFilter={this.defaultFilter}
              invoke={this.tableInvoke}
              headerActions={
                <>
                  <TasksJournalSettings
                    properties={taskSchema?.properties || []}
                    hiddenFields={this.hiddenFields}
                    onChangeHiddenFields={this.setHiddenFields}
                  />

                  <TasksJournalCreate />
                </>
              }
            />
          </>
        )}

        {!organizationSettings.taskManagement && <EmptyListView text={'Доступ запрещён'} />}
      </div>
    );
  }

  @computed
  private get cols(): XTableColumn<Task>[] {
    const actions: XTableColumn<Task> = {
      CellContent: this.renderActions,
      align: 'center',
      minWidth: 60,
      cellProps: { padding: 'checkbox' }
    };

    const cols: XTableColumn<Task>[] = [
      actions,
      ...getXTableColumnsFromSchema<Task>(taskSchema, [
        {
          field: 'id',
          hidden: false,
          type: XTableExtraColumnType.ID
        },
        {
          field: 'status',
          hidden: false,
          cellProps: { className: cnTasksJournal('CellStatus') },
          BeforeCellContent: this.renderTableRoleSelect
        }
      ])
    ].map(
      (item: XTableColumn<Task>): XTableColumn<Task> => ({
        ...item,
        hidden: this.hiddenFields.includes(String(item.field)) || item.hidden
      })
    );

    return cols;
  }

  @boundMethod
  private renderTableRoleSelect({ rowData }: { rowData: Task }): ReactElement {
    return <TaskStatusIcon status={rowData.status} />;
  }

  private renderActions({ rowData }: { rowData: Task }): ReactElement {
    return <TasksJournalActions className={cnTasksJournal('Actions')} task={rowData} as='menu' />;
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[Task[], number]> {
    if (pageOptions.filter) {
      const filterById = getFieldFilterValue(pageOptions.filter, 'id') as { $in: number[] } | undefined;
      if (filterById) {
        const modifiedFilter = cloneDeep(pageOptions.filter);
        modifyFieldFilterValue(modifiedFilter, 'id');
        pageOptions = {
          ...pageOptions,
          filter: modifiedFilter,
          queryParams: {
            ...pageOptions.queryParams,
            recordId: filterById.$in.join(',')
          }
        };
      }
    }

    const [tasks, totalPages] = await getTasks(pageOptions);

    return [
      tasks.map(task => {
        const properties = taskSchema.properties;
        const taskCalculated = calculateValues<Task>(task, properties) as Task & Record<string, ValueOf<Task>>;
        for (const property of properties) {
          taskCalculated[property.name] = convertToComplexField(property, task) as ValueOf<Task>;
        }

        return taskCalculated;
      }),
      totalPages
    ];
  }

  private getStorageKey(): string {
    return `registrySettings_${currentUser.id}_tasks-journal_${this.props.id}`;
  }

  private storeSettings() {
    localStorage.setItem(this.getStorageKey(), JSON.stringify({ hiddenFields: this.hiddenFields || [] }));
  }

  private async restoreSettings() {
    await sleep(0);
    const settings = JSON.parse(localStorage.getItem(this.getStorageKey()) || '{}') as { hiddenFields?: string[] };

    if (settings.hiddenFields) {
      this.setHiddenFields(settings.hiddenFields);
    }
  }

  @action.bound
  private setHiddenFields(hiddenFields: string[]) {
    this.hiddenFields = hiddenFields;
    this.storeSettings();
  }
}
