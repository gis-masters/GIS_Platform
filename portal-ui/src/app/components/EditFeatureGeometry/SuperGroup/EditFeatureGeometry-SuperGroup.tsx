import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';

import { CoordinateEdited, GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { ContourAdd } from '../../Icons/ContourAdd';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';
import { EditFeatureGeometryDraw } from '../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryGroup } from '../Group/EditFeatureGeometry-Group.composed';
import { EditFeatureGeometryToolbar } from '../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryToolbarLeft } from '../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryToolbarRight } from '../ToolbarRight/EditFeatureGeometry-ToolbarRight';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-SuperGroup.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometrySuperGroupProps {
  geometryPart: CoordinateEdited[][];
  minCoordsPerGroup: number;
  groupsMustBeClosed?: boolean;
  index: number;
  store: EditFeatureGeometryStore;
  onPolygonDelete?(index: number): void;
}

@observer
export class EditFeatureGeometrySuperGroup extends Component<EditFeatureGeometrySuperGroupProps> {
  constructor(props: EditFeatureGeometrySuperGroupProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { geometryPart, minCoordsPerGroup, groupsMustBeClosed, store } = this.props;
    const anotherPolygonExists =
      store.geometryType === GeometryType.MULTI_POLYGON && (store.geometry?.coordinates.length || 0) > 1;
    const labelPart = selectLabelForGeometryType(
      store.geometryType,
      'новый контур (вырезку)',
      'новую линию',
      'новую группу'
    );

    return (
      <div className={cnEditFeatureGeometry('SuperGroup')}>
        <EditFeatureGeometryToolbar>
          <EditFeatureGeometryToolbarLeft>
            <EditFeatureGeometryDraw store={store} onDraw={this.handleNewGroupDraw} />
            <Tooltip title={`Добавить ${labelPart} списком координат`}>
              <IconButton onClick={this.handleGroupAdd}>
                <ContourAdd />
              </IconButton>
            </Tooltip>
          </EditFeatureGeometryToolbarLeft>
          <EditFeatureGeometryToolbarRight>
            {anotherPolygonExists && (
              <EditFeatureGeometryDelButton onClick={this.handlePolygonDelete} labelToDelete='полигон' />
            )}
          </EditFeatureGeometryToolbarRight>
        </EditFeatureGeometryToolbar>

        {geometryPart.map((coordGroup, i, coordinates) => (
          <EditFeatureGeometryGroup
            coordinates={coordGroup}
            minCoordsCount={minCoordsPerGroup}
            mustBeClosed={groupsMustBeClosed}
            canBeDeleted={coordinates.length > 1}
            onDelete={this.handleGroupDelete}
            multiple={coordinates.length > 1}
            store={store}
            index={i}
            key={i}
          />
        ))}
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
    const group: CoordinateEdited[] = [];

    for (let i = 0; i < this.props.minCoordsPerGroup; i++) {
      group.push(['', '']);
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
