import * as React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { compose } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';
import { env } from '../../../stores/Env.store';

import { EditFeatureGeometryGroup as GroupBase } from '../Group/EditFeatureGeometry-Group';
import { withMultiple } from '../Group/_multiple/EditFeatureGeometry-Group_multiple';
import { EditFeatureGeometryAddButton } from '../AddButton/EditFeatureGeometry-AddButton';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

const EditFeatureGeometryGroup = compose(withMultiple)(GroupBase);

interface EditFeatureGeometrySuperGroupProps {
  geometryPart: CoordinateEdited[][];
  minCoordsPerGroup: number;
  groupsMustBeClosed?: boolean;
  index: number;
}

@observer
export class EditFeatureGeometrySuperGroup extends React.Component<EditFeatureGeometrySuperGroupProps> {
  constructor (props: EditFeatureGeometrySuperGroupProps) {
    super(props);

    this.addGroupHandler = this.addGroupHandler.bind(this);
    this.deleteGroupHandler = this.deleteGroupHandler.bind(this);
  }

  render () {
    const { geometryPart, minCoordsPerGroup, groupsMustBeClosed } = this.props;

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

  @action
  private addGroupHandler () {
    this.props.geometryPart.push([['', ''], ['', '']]);
  }

  @action
  private deleteGroupHandler (i: number) {
    this.props.geometryPart.splice(i, 1);
  }
}
