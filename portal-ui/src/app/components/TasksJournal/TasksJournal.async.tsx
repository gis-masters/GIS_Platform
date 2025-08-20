import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined, PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { communicationService } from '../../services/communication.service';
import { Schema } from '../../services/data/schema/schema.models';
import { applyContentType, mergeContentTypes } from '../../services/data/schema/schema.utils';
import { Task } from '../../services/data/task/task.models';
import { getTasks, getTaskSchema } from '../../services/data/task/task.service';
import { PageOptions, ValueOf } from '../../services/models';
import { services } from '../../services/services';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../services/util/filters/filters';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { calculateValues } from '../../services/util/form/formValidation.utils';
import { SortParams } from '../../services/util/sortObjects';
import { currentUser } from '../../stores/CurrentUser.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { registryDefaultFilter } from '../DataManagement/DataManagement.utils';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { convertToComplexField } from '../Form/Form.utils';
import { Loading } from '../Loading/Loading';
import { Registry } from '../Registry/Registry';
import { RegistrySettings } from '../RegistrySettings/RegistrySettings';
import { TasksJournalActions } from '../TasksJournalActions/TasksJournalActions';
import { TaskStatusIcon } from '../TaskStatusIcon/TaskStatusIcon';
import { XTableProps } from '../XTable/XTable';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';
import { getXTableColumnsFromSchema } from '../XTable/XTable.utils';
import { TasksJournalCreateButton } from './CreateButton/TasksJournal-CreateButton';

import '!style-loader!css-loader!sass-loader!./TasksJournal.scss';

const cnTasksJournal = cn('TasksJournal');

@observer
export default class TasksJournal extends Component {
  @observable private hiddenFields: string[] = [];
  @observable private schema?: Schema;
  @observable private primalSchema?: Schema;
  private defaultSort: SortParams<Task> = { field: 'id', asc: false };
  private defaultFilter: FilterQuery = registryDefaultFilter;
  private tableInvoke: XTableProps<Task>['invoke'] = {};

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();

    communicationService.taskUpdated.on(async () => {
      if (this.tableInvoke && this.tableInvoke.reload) {
        await this.tableInvoke.reload();
      }
    });

    this.restoreSettings();
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    return (
      <div className={cnTasksJournal()}>
        {organizationSettings.taskManagement && this.schema ? (
          <>
            <Breadcrumbs
              items={[
                {
                  title: <HomeOutlined />,
                  itemType: 'button',
                  onClick: this.handleClick
                },
                { title: 'Задачи', itemType: 'button' }
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
              onPageOptionsChange={this.updateSchema}
              defaultFilter={this.defaultFilter}
              invoke={this.tableInvoke}
              headerActions={
                <>
                  <RegistrySettings
                    properties={this.schema?.properties || []}
                    hiddenFields={this.hiddenFields}
                    onChangeHiddenFields={this.setHiddenFields}
                  />

                  {this.primalSchema?.contentTypes && (
                    <TasksJournalCreateButton
                      icon={<PlaylistAdd />}
                      schema={this.primalSchema}
                      contentTypes={this.primalSchema.contentTypes}
                    />
                  )}
                </>
              }
            />
          </>
        ) : (
          <Loading visible={!!(organizationSettings.taskManagement && this.schema)} />
        )}

        {!organizationSettings.taskManagement && <EmptyListView text={'Доступ запрещён'} />}
      </div>
    );
  }

  @boundMethod
  private handleClick() {
    void services.router.navigateByUrl('/data-management');
  }

  @computed
  private get cols(): XTableColumn<Task>[] {
    if (!this.schema) {
      return [];
    }

    const actions: XTableColumn<Task> = {
      CellContent: this.renderActions,
      align: 'center',
      minWidth: 30,
      cellProps: { padding: 'checkbox' }
    };

    const cols: XTableColumn<Task>[] = [
      actions,
      ...getXTableColumnsFromSchema<Task>(this.schema, [
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
        },
        {
          field: 'content_type_id',
          hidden: false
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

  @boundMethod
  private renderActions({ rowData }: { rowData: Task }): ReactElement | undefined {
    if (!this.schema) {
      return;
    }

    return (
      <TasksJournalActions
        schema={this.schema}
        primalSchema={this.primalSchema}
        className={cnTasksJournal('Actions')}
        task={rowData}
        as='menu'
      />
    );
  }

  @boundMethod
  private async getData(pageOptions: PageOptions): Promise<[Task[], number]> {
    // костыль для корректной работы задач (+ починить заскипаные тесты если это нужно)
    if (pageOptions?.filter?.is_folder) {
      delete pageOptions.filter.is_folder;
    }

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
        const properties = this.primalSchema?.properties || [];
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
    return `tasksJournalSettings_${currentUser.id}`;
  }

  private storeSettings() {
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify({
        hiddenFields: this.hiddenFields || [],
        content_type_id: this.schema?.appliedContentType || null
      })
    );
  }

  private restoreSettings() {
    const settings = JSON.parse(localStorage.getItem(this.getStorageKey()) || '{}') as {
      hiddenFields?: string[];
      content_type_id?: string;
    };

    if (settings.hiddenFields) {
      this.setHiddenFields(settings.hiddenFields);
    }

    if (settings.content_type_id && this.primalSchema) {
      this.setSchema(applyContentType(this.primalSchema, settings.content_type_id));
    }
  }

  @boundMethod
  private updateSchema({ filter = {} }: PageOptions) {
    // костыль для корректной работы задач (+ починить заскипаные тесты если это нужно)
    if (filter?.is_folder) {
      delete filter.is_folder;
    }

    if (!this.primalSchema) {
      return;
    }

    const contentTypeId = getFieldFilterValue(filter, 'content_type_id') as FilterQuery;
    if (Object.keys(filter).length === 0 || !contentTypeId) {
      this.setSchema(this.primalSchema);

      return;
    }

    if (Array.isArray(contentTypeId.$in) && contentTypeId.$in.length === 1) {
      this.setSchema(applyContentType(this.primalSchema, String(contentTypeId.$in[0])));
    } else {
      const newContentType = mergeContentTypes(this.primalSchema, contentTypeId.$in as string[]);
      const newSchema = cloneDeep(this.primalSchema);

      newSchema.contentTypes?.push(newContentType);

      this.setSchema(applyContentType(newSchema, newContentType.id));
    }

    this.storeSettings();
  }

  @action.bound
  private setHiddenFields(hiddenFields: string[]) {
    this.hiddenFields = hiddenFields;
    this.storeSettings();
  }

  private async fetchSchema() {
    this.setPrimalSchema(await getTaskSchema());
    this.setSchema(await getTaskSchema());
  }

  @action.bound
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action.bound
  private setPrimalSchema(primalSchema: Schema) {
    this.primalSchema = primalSchema;
  }
}
