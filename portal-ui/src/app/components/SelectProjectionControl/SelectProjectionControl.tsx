import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { SpatialReferenceSystem } from '../../../server-types/common-contracts';
import { isArrayOfProjection, isProjection, Projection } from '../../services/data/projection/projection.models';
import { getProjection } from '../../services/data/projection/projection.service';
import { isStringArray } from '../../services/util/typeGuards/isStringArray';
import { Button } from '../Button/Button';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';
import { SelectProjectionControlChip } from './Chip/SelectProjectionControlChip';

import '!style-loader!css-loader!sass-loader!./SelectProjectionControl.scss';

const cnSelectProjectionControl = cn('SelectProjectionControl');

@observer
export class SelectProjectionControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private selectedProjection: Projection[] = [];

  private cols: XTableColumn<Projection>[] = [
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
      <div className={cnSelectProjectionControl()}>
        <div className={cnSelectProjectionControl('Wrapper')}>
          {!!this.selectedProjection?.length &&
            this.selectedProjection.map((proj, i) => {
              return <SelectProjectionControlChip key={i} projection={proj} onDelete={this.handleDelete} />;
            })}
        </div>

        <Button className={cnSelectProjectionControl('Button')} onClick={this.openDialog}>
          Выбрать систему координат
        </Button>

        <ChooseXTableDialog<Projection>
          data={[]}
          getData={getProjection}
          selectedItems={this.selectedProjection}
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
      const favoritesProjection = this.props.fieldValue;
      if (favoritesProjection?.length) {
        const selectedProjection = favoritesProjection.map(item => {
          try {
            const parsedItem = JSON.parse(item) as unknown;

            if (!isProjection(parsedItem)) {
              throw new Error('Ошибка при получении предпочитаемых систем координат');
            }

            return parsedItem;
          } catch {
            throw new Error('Ошибка при получении предпочитаемых систем координат');
          }
        });

        if (selectedProjection && isArrayOfProjection(selectedProjection)) {
          this.setSelectedProjection(selectedProjection);
          this.select(selectedProjection);
        }
      }
    }
  }

  @action.bound
  private select(items: Projection[]) {
    this.setSelectedProjection(items);

    const { onChange, property } = this.props;

    if (onChange) {
      onChange({
        value: items,
        propertyName: property.name
      });
    }

    this.closeDialog();
  }

  private getRowId(srs: SpatialReferenceSystem) {
    return srs.authName + String(srs.authSrid);
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private setSelectedProjection(selectedProjection: Projection[]) {
    this.selectedProjection = selectedProjection;
  }

  @action.bound
  private handleDelete(proj: Projection) {
    if (this.selectedProjection.length) {
      this.setSelectedProjection(this.selectedProjection.filter(item => item.proj4Text !== proj.proj4Text));

      this.select(this.selectedProjection);
    }
  }
}
