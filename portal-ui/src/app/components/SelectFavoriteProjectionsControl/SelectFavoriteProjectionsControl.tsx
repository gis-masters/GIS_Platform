import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { SpatialReferenceSystem } from '../../../server-types/common-contracts';
import { isProjection, Projection, projectionXTableCols } from '../../services/data/projections/projections.models';
import { getProjections } from '../../services/data/projections/projections.service';
import { isStringArray } from '../../services/util/typeGuards/isStringArray';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { SelectFavoriteProjectionsControlButton } from './Button/SelectFavoriteProjectionsControl-Button';
import { SelectFavoriteProjectionsControlChip } from './Chip/SelectFavoriteProjectionsControl-Chip';
import { SelectFavoriteProjectionsControlWrapper } from './Wrapper/SelectFavoriteProjectionsControl-Wrapper';

const cnSelectFavoriteProjectionsControl = cn('SelectFavoriteProjectionsControl');

@observer
export class SelectFavoriteProjectionsControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;
  @observable private selectedProjections: Projection[] = [];

  componentDidMount(): void {
    this.init();
  }

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnSelectFavoriteProjectionsControl()}>
        <SelectFavoriteProjectionsControlWrapper>
          {!!this.selectedProjections?.length &&
            this.selectedProjections.map((proj, i) => {
              return <SelectFavoriteProjectionsControlChip key={i} projection={proj} onDelete={this.handleDelete} />;
            })}
        </SelectFavoriteProjectionsControlWrapper>

        <SelectFavoriteProjectionsControlButton onClick={this.openDialog} />

        <ChooseXTableDialog<Projection>
          data={[]}
          getData={getProjections}
          selectedItems={this.selectedProjections}
          title={'Выбор системы координат'}
          open={this.dialogOpen}
          cols={projectionXTableCols}
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
    if (!isStringArray(this.props.fieldValue)) {
      return;
    }
    const favoritesProjection = this.props.fieldValue;

    if (!favoritesProjection?.length) {
      return;
    }

    const selectedProjections = favoritesProjection.map(item => {
      try {
        const parsedItem = JSON.parse(item) as unknown;

        if (!isProjection(parsedItem)) {
          throw new Error('Система координат не является проекцией');
        }

        return parsedItem;
      } catch {
        throw new Error(`Не удалось "прочитать" систему координат + ${item}`);
      }
    });

    if (selectedProjections) {
      this.setSelectedProjection(selectedProjections);
      this.select(selectedProjections);
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
    this.selectedProjections = selectedProjection;
  }

  @action.bound
  private handleDelete(proj: Projection) {
    if (this.selectedProjections.length) {
      this.setSelectedProjection(this.selectedProjections.filter(item => item.proj4Text !== proj.proj4Text));

      this.select(this.selectedProjections);
    }
  }
}
