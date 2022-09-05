import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Coordinate } from 'ol/coordinate';
import { DrawEvent } from 'ol/interaction/Draw';
import { Tooltip } from '@mui/material';
import { Brush, BrushOutlined, SvgIconComponent } from '@mui/icons-material';
import { Feature } from 'ol';
import { SimpleGeometry } from 'ol/geom';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { transform, olProjection } from '../../../services/geoserver/projections.service';
import { CoordinateEdited, GeometryType } from '../../../services/geoserver/wfs.models';
import { communicationService } from '../../../services/communication.service';
import { mapService } from '../../../services/map/map.service';
import { Emitter } from '../../../services/common/Emitter';
import { IconButton } from '../../IconButton/IconButton';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometryDraw');

interface EditFeatureGeometryDrawProps {
  point?: CoordinateEdited;
  store: EditFeatureGeometryStore;
  onDraw: (val: CoordinateEdited | CoordinateEdited[]) => void;
  Icon?: SvgIconComponent;
  IconWhenActive?: SvgIconComponent;
  tip?: string;
}

@observer
export class EditFeatureGeometryDraw extends Component<EditFeatureGeometryDrawProps> {
  @observable private active = false;

  constructor(props: EditFeatureGeometryDrawProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    communicationService.drawOff.on(() => {
      this.activate();
      this.clickHandler();
    }, this);

    if (!this.props.store.isValid) {
      this.deactivate();
      this.clickHandler();
    }

    mapService.modificationDisabled.on(this.deactivate);
  }

  componentWillUnmount() {
    if (this.active) {
      mapService.drawOff();
      mapService.disableDraftModification();
    }

    communicationService.off(this);
    Emitter.scopeOff(this);
  }

  render() {
    const { Icon, IconWhenActive, tip } = this.props;
    const IconNormal = Icon || BrushOutlined;
    const IconActive = IconWhenActive || Icon || Brush;

    return (
      <Tooltip title={tip || 'Рисовать на карте'}>
        <IconButton className={cnEditFeatureGeometryDraw()} onClick={this.clickHandler} checked={this.active}>
          {this.active ? <IconActive /> : <IconNormal />}
        </IconButton>
      </Tooltip>
    );
  }

  private get drawingGeometryType(): GeometryType {
    const { geometryType } = this.props.store;

    return geometryType === GeometryType.MULTI_POLYGON ? GeometryType.POLYGON : geometryType;
  }

  @action.bound
  private handleDraw(e: DrawEvent) {
    const { point, store, onDraw } = this.props;

    if (point) {
      const drawed = (e.feature as Feature<SimpleGeometry>).getGeometry()?.getCoordinates() as Coordinate;
      point.splice(0, point.length, ...transform(olProjection, store.currentProjection, drawed));
      onDraw(point);
    } else {
      const drawed = (e.feature as Feature<SimpleGeometry>).getGeometry().getCoordinates() as Coordinate[][];
      const newPart = drawed[0].map(coord => transform(olProjection, store.currentProjection, coord));
      onDraw(newPart);
    }
  }

  @boundMethod
  private clickHandler() {
    if (!this.active) {
      mapService.draw(this.drawingGeometryType, this.handleDraw);
      mapService.disableDraftModification();
      mapService.enableDraftModification();
      this.activate();
    } else {
      mapService.drawOff();
      mapService.disableDraftModification();
      this.deactivate();
    }
  }

  @action
  private activate() {
    this.active = true;
  }

  @action.bound
  private deactivate() {
    this.active = false;
  }
}
