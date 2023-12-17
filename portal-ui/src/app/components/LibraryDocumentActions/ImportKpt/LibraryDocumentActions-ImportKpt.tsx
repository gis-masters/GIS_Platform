import React, { Component } from 'react';
import { action, observable, makeObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { DownloadForOfflineOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { SelectVectorTableControl } from '../../SelectVectorTableControl/SelectVectorTableControl';
import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { FieldValidator } from '../../../services/formValidation.service';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { CrgLayer } from '../../../services/gis/layers/layers.models';
import { Datasource } from '../../AddLayerDialog/AddLayerDialog';
import { getDefaultValues } from '../../Form/Form.utils';
import { FormDialog } from '../../FormDialog/FormDialog';
import { importKpt } from '../../../services/data/kpt/kpt.service';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsImportKpt = cn('LibraryDocumentActions', 'ImportKpt');

interface LibraryDocumentActionsImportKptProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

const validateLayer: FieldValidator = value => {
  if (!value) {
    return ['Некорректное значение'];
  }
};

interface FormValue extends CrgLayer {
  datasource?: Datasource;
  layerType?: string;
}

@observer
export class LibraryDocumentActionsImportKpt extends Component<LibraryDocumentActionsImportKptProps> {
  @observable private formValue: Partial<FormValue> = getDefaultValues(this.fields);
  @observable private importDisabled = true;
  @observable private busy = false;
  @observable private open = false;

  constructor(props: LibraryDocumentActionsImportKptProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document } = this.props;

    return (
      document.libraryTableName === 'dl_data_kpt' && (
        <>
          <ActionsItem
            className={cnLibraryDocumentActionsImportKpt()}
            title='Импорт КПТ'
            as={as}
            onClick={this.openDialog}
            disabled={this.busy}
            icon={<DownloadForOfflineOutlined />}
          />

          <FormDialog
            className={cnLibraryDocumentActionsImportKpt('Dialog')}
            open={this.open}
            subtitle='Выберите таблицы для импорта'
            schema={{ properties: this.fields }}
            actionFunction={this.add}
            onFormChange={this.handleFormChange}
            disabled={this.importDisabled}
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
    this.setImportDisabled(!Object.values(formValue).filter(item => item !== true).length);

    this.formValue = formValue;
  }

  @boundMethod
  private async add() {
    this.setBusy(true);

    const dataSources = Object.values(this.formValue).filter(item => item !== true) as Datasource[];
    const tables = dataSources.map(table => {
      return { dataset: table.vectorTable.dataset, table: table.vectorTable.identifier };
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

      Toast.success(`выполняется задача импорт кпт №${response.id}`);
    } catch {
      this.setBusy(false);
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
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'oks_pro',
        title: 'Объекты капитального строительства (полиогональные)',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'oks_polyline_pro',
        title: 'Объекты капитального строительства (линейные)',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'oks_constructions_points',
        title: 'Объекты капитального строительства (точечные)',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'zouit_pro',
        title: 'Зоны с особыми условиями использования территорий',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'borderwaterobj',
        title: 'Береговая линия (полиогональные)',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'borderwaterobj_polyline',
        title: 'Береговая линия (линейные)',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'municipalityBoundariesEGRN',
        title: 'Границы муниципальных образований',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
      },
      {
        propertyType: PropertyType.CUSTOM,
        name: 'kvartal_kpt',
        title: 'Кадастровые кварталы',
        defaultValue: true,
        ControlComponent: props => <SelectVectorTableControl writableOnly {...props} />,
        validationFormula: validateLayer
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
  private setImportDisabled(importDisabled: boolean) {
    this.importDisabled = importDisabled;
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
