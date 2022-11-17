import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { sidebars } from '../../../stores/Sidebars.store';
import { getLayerByFeatureInCurrentProject } from '../../../services/gis/layers.service';
import { isUpdateAllowed } from '../../../services/data/permissions.service';
import { CrgVectorLayer } from '../../../services/gis/projects.models';
import { FilterQuery } from '../../../services/util/filterObjects';

import { AttributesCheck } from '../Check/Attributes-Check';
import { AttributesTableRecord } from '../Table/Attributes-Table';
import { AttributesEditMark } from '../EditMark/Attributes-EditMark';
import { AttributesRowActions } from '../RowActions/Attributes-RowActions';

import '!style-loader!css-loader!sass-loader!./Attributes-RowHead.scss';

const cnAttributesRowHead = cn('Attributes', 'RowHead');

interface AttributesRowHeadProps {
  rowData: AttributesTableRecord;
  field: keyof AttributesTableRecord;
  filterActive: boolean;
  filterParams: FilterQuery;
}

@observer
export class AttributesRowHead extends Component<AttributesRowHeadProps> {
  private fetchingPermissionOperationId: symbol;
  @observable private editable = false;

  constructor(props: AttributesRowHeadProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchPermission();
  }

  async componentDidUpdate(prevProps: AttributesRowHeadProps) {
    if (this.props.rowData.feature.id.split('.')[0] !== prevProps.rowData.feature.id.split('.')[0]) {
      await this.fetchPermission();
    }
  }

  render() {
    const { rowData } = this.props;
    const opened = sidebars.editOpen && sidebars.editFeaturesData.features.some(({ id }) => id === rowData.feature.id);

    return (
      <span className={cnAttributesRowHead()}>
        <AttributesRowActions feature={rowData.feature} editable={this.editable} layer={this.layer} />

        {opened && <AttributesEditMark readonly={!this.editable} />}

        <AttributesCheck feature={rowData.feature} />
      </span>
    );
  }

  @computed
  private get layer(): CrgVectorLayer | undefined {
    return getLayerByFeatureInCurrentProject(this.props.rowData.feature);
  }

  private async fetchPermission() {
    const operationId = Symbol();
    this.fetchingPermissionOperationId = operationId;

    if (!this.layer) {
      this.setEditable(false);

      return;
    }

    const editable = await isUpdateAllowed(this.layer);

    if (this.fetchingPermissionOperationId === operationId) {
      this.setEditable(editable);
    }
  }

  @action
  private setEditable(editable: boolean) {
    this.editable = editable;
  }
}
