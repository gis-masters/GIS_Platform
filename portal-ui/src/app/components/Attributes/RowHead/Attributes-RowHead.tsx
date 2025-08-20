import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { extractTableNameFromFeatureId } from '../../../services/geoserver/featureType/featureType.util';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { getLayerByFeatureInCurrentProject } from '../../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { isUpdateAllowed } from '../../../services/permissions/permissions.service';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { sidebars } from '../../../stores/Sidebars.store';
import { AttributesTableRecord } from '../Attributes.models';
import { AttributesCheck } from '../Check/Attributes-Check';
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
  private fetchingPermissionOperationId?: symbol;
  @observable private editable = false;

  constructor(props: AttributesRowHeadProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchPermission();
  }

  async componentDidUpdate(prevProps: AttributesRowHeadProps) {
    if (
      extractTableNameFromFeatureId(this.props.rowData.feature.id) !==
      extractTableNameFromFeatureId(prevProps.rowData.feature.id)
    ) {
      await this.fetchPermission();
    }
  }

  render() {
    const { rowData } = this.props;
    const opened =
      sidebars.editFeatureOpen &&
      editFeatureStore.editFeaturesData?.features.some(({ id }) => id === rowData.feature.id);

    return (
      <span className={cnAttributesRowHead()}>
        {this.layer && <AttributesRowActions feature={rowData.feature} editable={this.editable} layer={this.layer} />}

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
