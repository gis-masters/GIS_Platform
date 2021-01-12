import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { compose } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { CoordinateEdited } from '../../../services/geoserver/wfs.models';
import { env } from '../../../stores/Env.store';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryGroup as GroupBase } from '../Group/EditFeatureGeometry-Group';
import { withMultiple } from '../Group/_multiple/EditFeatureGeometry-Group_multiple';
import { EditFeatureGeometryAddButton } from '../AddButton/EditFeatureGeometry-AddButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-SuperGroup.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

const EditFeatureGeometryGroup = compose(withMultiple)(GroupBase);

interface EditFeatureGeometrySuperGroupProps {
  geometryPart: CoordinateEdited[][];
  minCoordsPerGroup: number;
  groupsMustBeClosed?: boolean;
  index: number;
  store: EditFeatureGeometryStore;
}

@observer
export class EditFeatureGeometrySuperGroup extends Component<EditFeatureGeometrySuperGroupProps> {
  render() {
    const { geometryPart, minCoordsPerGroup, groupsMustBeClosed, store } = this.props;

    return (
      <div className={cnEditFeatureGeometry('SuperGroup')}>
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

        {env.platform !== 'simf' ? (
          <EditFeatureGeometryAddButton onClick={this.addGroupHandler}>
            Добавить контур/линию
          </EditFeatureGeometryAddButton>
        ) : null}
      </div>
    );
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
}
