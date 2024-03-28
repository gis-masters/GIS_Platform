import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import {
  EpsgModelModified,
  isArrayOfEpsgModelModified,
  isEpsgModelModified
} from '../../services/data/epsg/epsg.models';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';
import { isStringArray } from '../../services/util/typeGuards/isStringArray';
import { SelectEPSGControlChip } from './Chip/SelectEPSGControl-Chip';
import { getKnownEpsg } from '../../services/data/epsg/epsg.service';
import { EpsgModel } from '../../../server-types/common-contracts';
import { FormControlProps } from '../Form/Control/Form-Control';
import { PageOptions } from '../../services/models';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectEPSGControl.scss';

const cnSelectEPSGControl = cn('SelectEPSGControl');

@observer
export class SelectEPSGControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private selectedEPSG: EpsgModelModified[] = [];

  private cols: XTableColumn<EpsgModelModified>[] = [
    {
      field: 'title',
      title: 'Система координат',
      minWidth: 300
    },
    {
      field: 'authName',
      title: 'Тип SRID'
    },
    {
      field: 'auth_srid',
      title: 'Код SRID',
      type: XTableExtraColumnType.ID,
      filterable: true,
      sortable: true
    },
    {
      field: 'srtext',
      title: 'srtext',
      filterable: true,
      minWidth: 300
    },
    {
      field: 'proj4Text',
      title: 'proj4Text',
      filterable: true,
      minWidth: 300
    }
  ];

  componentDidMount(): void {
    this.init();
  }

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnSelectEPSGControl()}>
        <div className={cnSelectEPSGControl('Wrapper')}>
          {!!this.selectedEPSG?.length &&
            this.selectedEPSG.map((epsg, i) => {
              return <SelectEPSGControlChip key={i} epsg={epsg} onDelete={this.handleDelete} />;
            })}
        </div>

        <Button className={cnSelectEPSGControl('Button')} onClick={this.openDialog}>
          Выбрать систему координат
        </Button>

        <ChooseXTableDialog<EpsgModelModified>
          data={[]}
          getData={this.getProjections}
          selectedItems={this.selectedEPSG}
          title={'Выбор системы координат'}
          open={this.dialogOpen}
          cols={this.cols}
          getRowId={this.getRowId}
          onClose={this.closeDialog}
          onSelect={this.select}
          withoutSelectAll
        />
      </div>
    );
  }

  @boundMethod
  private init() {
    if (isStringArray(this.props.fieldValue)) {
      const favoritesEpsg = this.props.fieldValue;

      if (favoritesEpsg?.length) {
        const selectedEPSG = favoritesEpsg.map(item => {
          try {
            const parsedItem = JSON.parse(item) as unknown;

            if (!isEpsgModelModified(parsedItem)) {
              throw new Error('Ошибка при получении предпочитаемых систем координат');
            }

            return parsedItem;
          } catch {
            throw new Error('Ошибка при получении предпочитаемых систем координат');
          }
        });

        if (selectedEPSG && isArrayOfEpsgModelModified(selectedEPSG)) {
          this.setSelectedEPSG(selectedEPSG);
          this.select(selectedEPSG);
        }
      }
    }
  }

  @action.bound
  private select(items: EpsgModelModified[]) {
    this.setSelectedEPSG(items);

    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: items,
        propertyName: property.name
      });
    }

    this.closeDialog();
  }

  private getRowId(rowData: EpsgModel) {
    return rowData.authName + String(rowData.authSrid);
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  private async getProjections(pageOptions: PageOptions): Promise<[EpsgModelModified[], number]> {
    const [projections, totalPages] = await getKnownEpsg(pageOptions);

    return [projections, totalPages];
  }

  @action.bound
  private setSelectedEPSG(selectedEPSG: EpsgModelModified[]) {
    this.selectedEPSG = selectedEPSG;
  }

  @action.bound
  private handleDelete(epsg: EpsgModelModified) {
    if (this.selectedEPSG.length) {
      this.setSelectedEPSG(this.selectedEPSG.filter(item => item.proj4Text !== epsg.proj4Text));

      this.select(this.selectedEPSG);
    }
  }
}
