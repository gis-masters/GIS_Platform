import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { LineString, Polygon } from 'ol/geom';

import { Projection } from '../../services/data/projections/projections.models';
import { getFeatureArea, getFeatureLength } from '../../services/map/labels/map-labels.util';
import { MeasureItem } from '../../services/map/measure/map-measure.models';
import { UnitsOfAreaMeasurement, UnitsOfLengthMeasurement } from '../../services/util/open-layers.util';
import { mapMeasureStore } from '../../stores/MapMeasure.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { PseudoLink } from '../PseudoLink/PseudoLink';

import '!style-loader!css-loader!sass-loader!./MapMeasureTooltip.scss';

const cnMapMeasureTooltip = cn('MapMeasureTooltip');

interface MapMeasureTooltipProps {
  item: MeasureItem;
  sketch: boolean;
  projection: Projection;

  onClear(item: MeasureItem): void;
}

@observer
export class MapMeasureTooltip extends Component<MapMeasureTooltipProps> {
  render() {
    const { item, sketch, projection } = this.props;
    const { printingInProcess, printingResolution } = printSettings;
    const geometry = item.feature.getGeometry();

    let value: number | undefined;
    let units: UnitsOfAreaMeasurement | UnitsOfLengthMeasurement | undefined;
    let switchingUnitsEnabled = false;

    if (geometry instanceof Polygon) {
      [value, units] = getFeatureArea({
        geometry,
        units: mapMeasureStore.unitsOfAreaMeasurement,
        projection,
        precision: 2
      });
      if (
        !sketch &&
        (value > 100 || units === UnitsOfAreaMeasurement.HECTARE || units === UnitsOfAreaMeasurement.SQUARE_KILOMETER)
      ) {
        switchingUnitsEnabled = true;
      }
    } else if (geometry instanceof LineString) {
      [value, units] = getFeatureLength({ geometry, projection, isMeasure: true });
    }

    return (
      <div
        className={cnMapMeasureTooltip({
          state: sketch ? 'sketch' : 'static',
          printing: printingInProcess
        })}
        style={{ '--MapMeasureTooltipPrintingResolution': printingResolution }}
      >
        {value}{' '}
        {switchingUnitsEnabled && !printingInProcess ? (
          <PseudoLink className={cnMapMeasureTooltip('UnitsSwitcher')} onClick={this.switchSquareUnits} color='inherit'>
            {units}
          </PseudoLink>
        ) : (
          units
        )}
        {!sketch && (
          <IconButton size='small' onClick={this.handleClear} className={cnMapMeasureTooltip('Clear')}>
            <Close fontSize='inherit' />
          </IconButton>
        )}
      </div>
    );
  }

  @boundMethod
  private handleClear() {
    const { item, onClear } = this.props;
    onClear(item);
  }

  @boundMethod
  private switchSquareUnits() {
    if (mapMeasureStore.unitsOfAreaMeasurement === UnitsOfAreaMeasurement.HECTARE) {
      mapMeasureStore.setUnitsOfAreaMeasurement(UnitsOfAreaMeasurement.SQUARE_KILOMETER);
    } else if (mapMeasureStore.unitsOfAreaMeasurement === UnitsOfAreaMeasurement.SQUARE_KILOMETER) {
      mapMeasureStore.setUnitsOfAreaMeasurement(UnitsOfAreaMeasurement.HECTARE);
    }
  }
}
