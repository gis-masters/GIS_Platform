import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DownloadForOfflineOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { importKpt } from '../../../services/data/kpt/kpt.service';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { ActionTypes, DataTypes } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { ExplorerItemData, ExplorerItemType, isExplorerItemData } from '../../Explorer/Explorer.models';
import { getDefaultValues } from '../../Form/Form.utils';
import { FormDialog } from '../../FormDialog/FormDialog';
import { SelectedVectorTable, SelectVectorTableControl } from '../../SelectVectorTableControl/SelectVectorTableControl';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsImportKpt = cn('LibraryDocumentActions', 'ImportKpt');

interface LibraryDocumentActionsImportKptProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  disabled?: boolean;
}

type FormValue = Record<string, SelectedVectorTable>;

@observer
export class LibraryDocumentActionsImportKpt extends Component<LibraryDocumentActionsImportKptProps> {
  @observable private formValue: Partial<FormValue> = getDefaultValues(this.fields);
  @observable private busy = false;
  @observable private open = false;
  @observable private lastPath?: ExplorerItemData[];

  constructor(props: LibraryDocumentActionsImportKptProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document, disabled } = this.props;
    const role = document.role;

    if (!role) {
      return;
    }

    return (
      document.libraryTableName === 'dl_data_kpt' && (
        <>
          <ActionsItem
            className={cnLibraryDocumentActionsImportKpt()}
            title='Импорт КПТ'
            tooltipText={
              disabled ? getAvailableActionsTooltipByRole(ActionTypes.IMPORT_KPT, role, DataTypes.DOC) : undefined
            }
            as={as}
            onClick={this.openDialog}
            disabled={this.busy || disabled}
            icon={<DownloadForOfflineOutlined />}
          />

          <FormDialog
            className={cnLibraryDocumentActionsImportKpt('Dialog')}
            open={this.open}
            subtitle='Выберите таблицы для импорта'
            schema={{ properties: this.fields }}
            actionFunction={this.doImport}
            onFormChange={this.handleFormChange}
            onFieldChange={this.handleFieldChange}
            actionButtonProps={{ children: 'Импортировать' }}
            onClose={this.close}
            value={this.formValue}
            title='Импорт КПТ'
          />
        </>
      )
    );
  }

  @action.bound
  private handleFormChange(formValue: FormValue) {
    this.formValue = formValue;
  }

  @action.bound
  private handleFieldChange(value: SelectedVectorTable): void {
    if (
      value &&
      typeof value === 'object' &&
      'path' in value &&
      Array.isArray(value.path) &&
      value.path.every(item => isExplorerItemData(item))
    ) {
      this.lastPath = value.path;
    }
  }

  @boundMethod
  private async doImport() {
    this.setBusy(true);

    const dataSources = Object.values(this.formValue).filter(notFalsyFilter);

    if (!dataSources.length) {
      throw new Error('Необходимо выбрать хотя бы один слой для импорта');
    }

    dataSources.forEach(item => {
      delete item.path;
    });

    const tables = dataSources.map(source => {
      return { dataset: source.vectorTable?.dataset, table: source.vectorTable?.identifier };
    });

    const importRequest = {
      documentId: this.props.document.id,
      tables,
      validationSettings: {
        validateRecordsCount: true,
        validateFreshness: true
      }
    };

    try {
      const response = await importKpt(importRequest);

      Toast.success(`Выполняется задача "Импорт кпт №${response.id}"`);
    } catch (error) {
      this.setBusy(false);
      throw error;
    }

    this.setBusy(false);
    this.close();
  }

  @computed
  private get fields(): PropertySchema[] {
    return [
      {
        propertyType: PropertyType.CUSTOM,
        name: 'zu_pro',
        title: 'Земельные участки',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%zu_pro%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'oks_pro',
        title: 'Объекты капитального строительства (полигональные)',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%oks_pro%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'oks_polyline',
        title: 'Объекты капитального строительства (линейные)',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%oks_polyline%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'oks_constructions_points',
        title: 'Объекты капитального строительства (точечные)',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%oks_constructions%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'zouit_pro',
        title: 'Зоны с особыми условиями использования территорий',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%zouit_pro%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'borderwaterobj',
        title: 'Береговая линия (полигональные)',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            $and: [
              {
                identifier: {
                  $like: '%borderwaterobj%'
                }
              },
              {
                $not: {
                  identifier: {
                    $like: '%polilyne%'
                  }
                }
              }
            ]
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'borderwaterobj_polyline',
        title: 'Береговая линия (линейные)',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%borderwaterobj_polilyne%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'municipalityBoundariesEGRN',
        title: 'Границы муниципальных образований',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%municipality_boundaries_egrn%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'kvartal_kpt',
        title: 'Кадастровые кварталы',
        startPath: this.lastPath,
        writableTablesOnly: true,
        customFilters: {
          [ExplorerItemType.DATASET]: {
            identifier: {
              $like: '%kvartal_kpt%'
            }
          }
        },
        ControlComponent: SelectVectorTableControl
      }
    ];
  }

  @action.bound
  private close() {
    this.clearForm();
    this.closeDialog();
  }

  @action.bound
  private clearForm() {
    this.formValue = getDefaultValues(this.fields);
  }

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private closeDialog() {
    this.open = false;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
