import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Brush, BrushOutlined, SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { SimpleGeometry } from 'ol/geom';
import { DrawEvent } from 'ol/interaction/Draw';

import { Emitter } from '../../../services/common/Emitter';
import { communicationService } from '../../../services/communication.service';
import { transform } from '../../../services/data/projections/projections.util';
import { CoordinateEdited, GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { mapService } from '../../../services/map/map.service';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { IconButton } from '../../IconButton/IconButton';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometryDraw');

interface EditFeatureGeometryDrawProps {
  point?: CoordinateEdited;
  store: EditFeatureGeometryStore;
  Icon?: SvgIconComponent;
  IconWhenActive?: SvgIconComponent;
  tip?: string;
  onDraw(val: CoordinateEdited | CoordinateEdited[]): void;
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
      this.handleClick();
    }, this);

    if (!this.props.store.isValid) {
      this.deactivate();
      this.handleClick();
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
        <IconButton className={cnEditFeatureGeometryDraw()} onClick={this.handleClick} checked={this.active}>
          {this.active ? <IconActive /> : <IconNormal />}
        </IconButton>
      </Tooltip>
    );
  }

  private get drawingGeometryType(): GeometryType | undefined {
    const { geometryType } = this.props.store;

    return geometryType === GeometryType.MULTI_POLYGON ? GeometryType.POLYGON : geometryType;
  }

  @action.bound
  private handleDraw(e: DrawEvent) {
    const { point, store, onDraw } = this.props;

    if (!projectionsStore.olProjection || !store.currentProjection) {
      throw new Error('Внезапно пропала проекция, необходимая для рисования на карте');
    }

    if (point) {
      const drawed = (e.feature as Feature<SimpleGeometry>).getGeometry()?.getCoordinates() as Coordinate;
      point.splice(0, point.length, ...transform(projectionsStore.olProjection, store.currentProjection, drawed));
      onDraw(point);
    } else {
      let drawed = (e.feature as Feature<SimpleGeometry>).getGeometry()?.getCoordinates() as
        | Coordinate[]
        | Coordinate[][];

      if (Array.isArray(drawed[0][0])) {
        drawed = drawed[0] as Coordinate[];
      }

      const newPart = (drawed as Coordinate[]).map((coord: Coordinate) => {
        if (!projectionsStore.olProjection || !store.currentProjection) {
          throw new Error('Внезапно пропала проекция, необходимая для рисования на карте');
        }

        return transform(projectionsStore.olProjection, store.currentProjection, coord);
      });

      onDraw(newPart);
    }
  }

  @boundMethod
  private handleClick() {
    if (this.active) {
      mapService.drawOff();
      mapService.disableDraftModification();
      this.deactivate();
    } else {
      if (!this.drawingGeometryType) {
        return;
      }
      mapService.draw(this.drawingGeometryType, this.handleDraw);
      mapService.disableDraftModification();
      mapService.enableDraftModification();
      this.activate();
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
