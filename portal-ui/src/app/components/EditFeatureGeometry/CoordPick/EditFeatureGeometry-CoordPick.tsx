import React, { Component, createRef } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { IconButton, Tooltip } from '@material-ui/core';
import { LocationSearching, SvgIconComponent } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { olProjection, transform } from '../../../services/geoserver/projections.service';
import { mapService } from '../../../services/map/map.service';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CoordPick.scss';

const cnEditFeatureGeometryCoordPick = cn('EditFeatureGeometry', 'CoordPick');

interface EditFeatureGeometryCoordPickProps {
  disabled?: boolean;
  onPickStart?: () => void;
  onPickEnd?: () => void;
  onPick: (val: Coordinate) => void;
  store: EditFeatureGeometryStore;
  Icon?: SvgIconComponent;
  size: 'small' | 'medium';
}

@observer
export class EditFeatureGeometryCoordPick extends Component<EditFeatureGeometryCoordPickProps> {
  @observable private picking = false;
  private btnRef = createRef<HTMLButtonElement>();

  componentWillUnmount() {
    this.offPicking();
  }

  render() {
    const { disabled, Icon = LocationSearching, size } = this.props;

    return (
      <Tooltip title='Указать на карте' enterDelay={800}>
        <span>
          <IconButton
            className={cnEditFeatureGeometryCoordPick({ size })}
            onKeyDown={this.keyHandler}
            onClick={this.btnClickHandler}
            onBlur={this.blurHandler}
            aria-label='pick'
            size={size}
            ref={this.btnRef}
            disabled={disabled}
            color={this.picking ? 'secondary' : 'default'}
          >
            <Icon />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @action
  private offPicking() {
    this.picking = false;
    document.body.classList.remove('global-crosshair-cursor');
    if (this.btnRef.current) {
      this.btnRef.current.blur();
    }
    mapService.pickingOff();

    if (this.props.onPickEnd) {
      this.props.onPickEnd();
    }
  }

  @action
  private pick() {
    this.picking = true;
    mapService.pickPoint(this.pickHandler);
    document.body.classList.add('global-crosshair-cursor');
    if (this.props.onPickStart) {
      this.props.onPickStart();
    }
  }

  @boundMethod
  private blurHandler() {
    setTimeout(() => {
      this.offPicking();
    }, 600);
  }

  @boundMethod
  private keyHandler(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Escape') {
      this.offPicking();
    }
  }

  @boundMethod
  private btnClickHandler() {
    if (this.picking) {
      this.offPicking();
    } else {
      this.pick();
    }
  }

  @action.bound
  private pickHandler(e: MapBrowserEvent<UIEvent>) {
    const { store, onPick } = this.props;
    onPick(transform(olProjection, store.currentProjection, e.coordinate));
    this.offPicking();
  }
}
