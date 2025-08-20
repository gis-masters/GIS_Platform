import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Brush, BrushOutlined, SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Emitter } from '../../../services/common/Emitter';
import { communicationService } from '../../../services/communication.service';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { toDrawGeometry } from '../../../services/map/draw/map-draw.util';
import { ToolMode } from '../../../services/map/map.models';
import { services } from '../../../services/services';
import { mapStore } from '../../../stores/Map.store';
import { IconButton } from '../../IconButton/IconButton';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometryDraw');

interface EditFeatureGeometryDrawProps {
  Icon?: SvgIconComponent;
  IconWhenActive?: SvgIconComponent;
}

@observer
export class EditFeatureGeometryDraw extends Component<EditFeatureGeometryDrawProps> {
  constructor(props: EditFeatureGeometryDrawProps) {
    super(props);
  }

  componentWillUnmount() {
    mapDrawService.drawOff();

    communicationService.off(this);
    Emitter.scopeOff(this);
  }

  render() {
    const { Icon, IconWhenActive } = this.props;
    const IconNormal = Icon || BrushOutlined;
    const IconActive = IconWhenActive || Icon || Brush;

    return (
      <Tooltip title='Редактировать геометрию'>
        <span>
          <IconButton
            className={cnEditFeatureGeometryDraw()}
            onClick={this.handleClick}
            checked={mapStore.toolMode === ToolMode.DRAW}
          >
            {mapStore.toolMode === ToolMode.DRAW ? <IconActive /> : <IconNormal />}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick() {
    if (!editFeatureStore.editFeaturesData?.features.length) {
      services.logger.error('Нет фичи для редактирования геометрии');

      return;
    }

    if (this.isDrawEnabled()) {
      mapDrawService.drawOff();
    } else {
      void mapDrawService.drawOn(toDrawGeometry(editFeatureStore.geometryType));
    }
  }

  private isDrawEnabled(): boolean {
    return mapStore.toolMode === ToolMode.DRAW;
  }
}
