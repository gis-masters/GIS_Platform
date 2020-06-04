import React, { Component, ChangeEvent } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Switch } from '@material-ui/core';
import { ModifyEvent } from 'ol/interaction/Modify';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { openLayersService } from '../../../services/open-layer/open-layers.service';
import { transformGeometry, olProjection } from '../../../services/geoserver/projections.service';
import { FormField, FormLabel, FormControl } from '../../Form/Form';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Modify.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryModifyProps {
  store: EditFeatureGeometryStore;
}

@observer
export class EditFeatureGeometryModify extends Component<EditFeatureGeometryModifyProps> {
  @observable private checked = false;

  constructor (props: EditFeatureGeometryModifyProps) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.modifyHandler = this.modifyHandler.bind(this);
  }

  componentWillUnmount () {
    openLayersService.disableDraftModification(this.modifyHandler);
  }

  render () {
    return (
      <FormField className={cnEditFeatureGeometry('Modify')}>
        <FormLabel htmlFor='editFeatureGeometryModifyControl'>
          Рисование
        </FormLabel>
        <FormControl>
          <Switch
            id='editFeatureGeometryModifyControl'
            checked={this.checked}
            onChange={this.changeHandler}
            disabled={!this.props.store.isValid}
          />
        </FormControl>
      </FormField>
    );
  }

  @action
  changeHandler (e: ChangeEvent<HTMLInputElement>, checked: boolean) {
    this.checked = checked;

    if (checked) {
      openLayersService.enableDraftModification(this.modifyHandler);
    } else {
      openLayersService.disableDraftModification(this.modifyHandler);
    }
  }

  private modifyHandler (e: ModifyEvent) {
    const olGeometry = e.features.item(0).getGeometry();
    const { nativeProjection, geometry, geometryType, setGeometry } = this.props.store;
    const { coordinates } = transformGeometry(
                          // @ts-ignore
                          { type: geometryType, coordinates: olGeometry.getCoordinates() },
                          olProjection,
                          nativeProjection);

    // @ts-ignore
    setGeometry({
      ...geometry,
      coordinates
    });
  }
}
