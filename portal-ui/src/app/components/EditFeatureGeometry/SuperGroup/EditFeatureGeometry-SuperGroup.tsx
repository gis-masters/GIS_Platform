import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isNumber } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { ContourAdd } from '../../Icons/ContourAdd';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';
import { EditFeatureGeometryGroup } from '../Group/EditFeatureGeometry-Group.composed';
import { EditFeatureGeometryToolbar } from '../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryToolbarLeft } from '../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryToolbarRight } from '../ToolbarRight/EditFeatureGeometry-ToolbarRight';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-SuperGroup.scss';

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
    const labelPart = selectLabelForGeometryType(
      editFeatureStore.geometryType,
      'новый контур (вырезку)',
      'новую линию',
      'новую группу'
    );

    return (
      <div className={cnEditFeatureGeometry('SuperGroup')}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryToolbarLeft>
            <Tooltip title={`Добавить ${labelPart} списком координат`}>
              <span>
                <IconButton onClick={this.handleGroupAdd} color='primary'>
                  <ContourAdd />
                </IconButton>
              </span>
            </Tooltip>
          </EditFeatureGeometryToolbarLeft>
          <EditFeatureGeometryToolbarRight>
            {anotherPolygonExists && (
              <EditFeatureGeometryDelButton onClick={this.handlePolygonDelete} labelToDelete='полигон' />
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

  @computed
  private get isLastGroupEmpty(): boolean {
    const { geometryPart } = this.props;

    return !geometryPart?.at(-1)?.some(coordinate => coordinate.some(Boolean));
  }

  @action.bound
  private handleGroupAdd() {
    const group: Coordinate[] = [];

    for (let i = 0; i < this.props.minCoordsPerGroup; i++) {
      group.push([0, 0]);
    }

    this.props.geometryPart.push(group);
  }

  @action.bound
  private handleGroupDelete(i: number) {
    this.props.geometryPart.splice(i, 1);
  }

  @boundMethod
  private handlePolygonDelete() {
    const { onPolygonDelete, index } = this.props;
    if (onPolygonDelete) {
      onPolygonDelete(index);
    }
  }

  @action.bound
  private handleNewGroupDraw(newGroup: Coordinate[]) {
    const { geometryPart } = this.props;

    if (this.isLastGroupEmpty) {
      geometryPart?.at(-1)?.splice(0, geometryPart[0].length, ...newGroup);
    } else {
      geometryPart.push(newGroup);
    }
  }
}
