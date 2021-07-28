import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { IconButton, Tooltip } from '@material-ui/core';
import { Coordinate } from 'ol/coordinate';
import { compose } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs.util';
import { CoordinateEdited, GeometryType } from '../../../services/geoserver/wfs.models';
import { ContourAdd } from '../../Icons/ContourAdd';

import { EditFeatureGeometryToolbarRight } from '../ToolbarRight/EditFeatureGeometry-ToolbarRight';
import { EditFeatureGeometryToolbarLeft } from '../ToolbarLeft/EditFeatureGeometry-ToolbarLeft';
import { EditFeatureGeometryGroup as GroupBase } from '../Group/EditFeatureGeometry-Group';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';
import { withMultiple } from '../Group/_multiple/EditFeatureGeometry-Group_multiple';
import { EditFeatureGeometryToolbar } from '../Toolbar/EditFeatureGeometry-Toolbar';
import { EditFeatureGeometryDraw } from '../Draw/EditFeatureGeometry-Draw';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-SuperGroup.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

const EditFeatureGeometryGroup = compose(withMultiple)(GroupBase);

interface EditFeatureGeometrySuperGroupProps {
  geometryPart: CoordinateEdited[][];
  minCoordsPerGroup: number;
  groupsMustBeClosed?: boolean;
  index: number;
  store: EditFeatureGeometryStore;
  onPolygonDelete?: (index: number) => void;
}

@observer
export class EditFeatureGeometrySuperGroup extends Component<EditFeatureGeometrySuperGroupProps> {
  render() {
    const { geometryPart, minCoordsPerGroup, groupsMustBeClosed, store } = this.props;
    const anotherPolygonExists =
      store.geometryType === GeometryType.MULTI_POLYGON && store.geometry.coordinates.length > 1;
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
            <EditFeatureGeometryDraw store={store} onDraw={this.drawNewGroupHandler} />
            <Tooltip title={`Добавить ${labelPart} списком координат`}>
              <IconButton onClick={this.addGroupHandler}>
                <ContourAdd />
              </IconButton>
            </Tooltip>
          </EditFeatureGeometryToolbarLeft>
          <EditFeatureGeometryToolbarRight>
            {anotherPolygonExists && (
              <EditFeatureGeometryDelButton onClick={this.deletePolygonHandler} labelToDelete='полигон' />
            )}
          </EditFeatureGeometryToolbarRight>
        </EditFeatureGeometryToolbar>

        {geometryPart.map((coordGroup, i, coordinates) => (
          <EditFeatureGeometryGroup
            coordinates={coordGroup}
            minCoordsCount={minCoordsPerGroup}
            mustBeClosed={groupsMustBeClosed}
            canBeDeleted={coordinates.length > 1}
            onDelete={this.deleteGroupHandler}
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

    return !geometryPart[geometryPart.length - 1].some(coordinate => coordinate.some(dismention => dismention));
  }

  @action.bound
  private addGroupHandler() {
    const group = [];

    for (let i = 0; i < this.props.minCoordsPerGroup; i++) {
      group.push(['', '']);
    }

    this.props.geometryPart.push(group);
  }

  @action.bound
  private deleteGroupHandler(i: number) {
    this.props.geometryPart.splice(i, 1);
  }

  @boundMethod
  private deletePolygonHandler() {
    const { onPolygonDelete, index } = this.props;
    if (onPolygonDelete) {
      onPolygonDelete(index);
    }
  }

  @action.bound
  private drawNewGroupHandler(newGroup: Coordinate[]) {
    const { geometryPart } = this.props;

    if (this.isLastGroupEmpty) {
      geometryPart[geometryPart.length - 1].splice(0, geometryPart[0].length, ...newGroup);
    } else {
      geometryPart.push(newGroup);
    }
  }
}
