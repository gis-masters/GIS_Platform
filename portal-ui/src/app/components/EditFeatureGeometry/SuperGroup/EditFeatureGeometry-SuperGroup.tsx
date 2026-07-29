import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isNumber } from 'lodash';
import { type Coordinate } from 'ol/coordinate';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { coordinateHighlightService } from '../../../services/map/coordinate-highlight/coordinate-highlight.service';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { editFeatureStore } from '../../../stores/EditFeature.store';
import { editFeatureHistoryStore } from '../../../stores/EditFeatureHistory.store';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';
import { EditFeatureGeometryGroup } from '../Group/EditFeatureGeometry-Group.composed';
import { EditFeatureGeometryToolbar } from '../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryToolbarLeft } from '../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryToolbarRight } from '../ToolbarRight/EditFeatureGeometry-ToolbarRight';

import './EditFeatureGeometry-SuperGroup.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometrySuperGroupProps {
  geometryPart: Coordinate[][];
  minCoordsPerGroup: number;
  groupsMustBeClosed?: boolean;
  index: number;
  startingIndexes?: number[][];
  onPolygonDelete?(index: number): void;
}

@observer
export class EditFeatureGeometrySuperGroup extends Component<EditFeatureGeometrySuperGroupProps> {
  constructor(props: EditFeatureGeometrySuperGroupProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { geometryPart, minCoordsPerGroup, groupsMustBeClosed, startingIndexes } = this.props;
    const anotherPolygonExists =
      editFeatureStore.geometryType === GeometryType.MULTI_POLYGON &&
      (editFeatureStore.geometry?.coordinates.length || 0) > 1;

    return (
      <div className={cnEditFeatureGeometry('SuperGroup')}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryToolbarLeft />
          <EditFeatureGeometryToolbarRight>
            {anotherPolygonExists && (
              <EditFeatureGeometryDelButton
                onClick={this.handlePolygonDelete}
                labelToDelete='полигон'
                onMouseEnter={this.handlePolygonDeleteMouseEnter}
                onMouseLeave={this.handlePolygonDeleteMouseLeave}
              />
            )}
          </EditFeatureGeometryToolbarRight>
        </EditFeatureGeometryToolbar>

        {geometryPart.map((coordGroup, i, coordinates) => {
          let startIndex: number | undefined;

          if (startingIndexes && isNumber(startingIndexes[i][0])) {
            startIndex = startingIndexes[i][0];
          }

          return (
            <EditFeatureGeometryGroup
              coordinates={coordGroup}
              minCoordsCount={minCoordsPerGroup}
              mustBeClosed={groupsMustBeClosed}
              canBeDeleted={coordinates.length > 1}
              onDelete={this.handleGroupDelete}
              multiple={coordinates.length > 1}
              index={i}
              startIndex={startIndex}
              key={i}
            />
          );
        })}
      </div>
    );
  }

  @action.bound
  private async handleGroupDelete(i: number) {
    this.props.geometryPart.splice(i, 1);

    // Добавляем в историю как единый шаг
    if (editFeatureStore.geometry) {
      editFeatureHistoryStore.add(editFeatureStore.geometry, 'Удаление группы координат');
    }

    await mapDrawService.syncFeatureGeometryWithMap();
  }

  @boundMethod
  private handlePolygonDelete() {
    const { onPolygonDelete, index } = this.props;
    if (onPolygonDelete) {
      onPolygonDelete(index);
    }
  }

  @boundMethod
  private handlePolygonDeleteMouseEnter(): void {
    // Подсвечиваем все координаты полигона при наведении на кнопку удаления
    const allCoordinates = this.props.geometryPart.flat();
    coordinateHighlightService.setActiveGroup(allCoordinates);
  }

  @boundMethod
  private handlePolygonDeleteMouseLeave(): void {
    // Убираем подсветку координат полигона
    coordinateHighlightService.setActiveGroup(null);
  }
}
