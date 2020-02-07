import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { IClassNameProps } from '@bem-react/core'
import { cn } from '@bem-react/classname';

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';
import { transformDimension } from '../../../services/geoserver/wfs.service';

import { EditFeatureGeometryCoord } from '../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryAddButton } from '../AddButton/EditFeatureGeometry-AddButton';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';
import { EditFeatureGeometryAsText } from '../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryXY } from '../XY/EditFeatureGeometry-XY';

import '!style-loader!css-loader!sass-loader!../GroupFooter/EditFeatureGeometry-GroupFooter.scss';
import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Group.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

export type ContainerProps = React.PropsWithChildren<IClassNameProps>;

export interface EditFeatureGeometryGroupProps extends IClassNameProps {
  coordinates: CoordinateEdited[];
  minCoordsCount: number;
  mustBeClosed?: boolean;
  canBeDeleted: boolean;
  onDelete: (index: number) => void;
  Container?: React.ComponentType<ContainerProps>;
  multiple: boolean;
  index: number;
}

const Div = ((props: ContainerProps) => <div {...props} />);

@observer
export class EditFeatureGeometryGroup extends React.Component<EditFeatureGeometryGroupProps> {
  constructor (props: EditFeatureGeometryGroupProps) {
    super(props);

    this.deleteHandler = this.deleteHandler.bind(this);
    this.addHandler = this.addHandler.bind(this);
    this.deleteGroupHandler = this.deleteGroupHandler.bind(this);
  }

  render () {
    const { coordinates, minCoordsCount, canBeDeleted, className, Container, mustBeClosed } = this.props;
    const Tag = Container || Div;

    return (
      <Tag className={className}>
        <EditFeatureGeometryXY />

        {coordinates.map((coordinate, i) => {
          const isLast = i === coordinates.length - 1;

          return (
            <EditFeatureGeometryCoord
                val={coordinate}
                key={i}
                index={i}
                onDelete={this.deleteHandler}
                withControls={true}
                canBeDeleted={coordinates.length > minCoordsCount}
                etalon={isLast && mustBeClosed ? coordinates[0].map(transformDimension) : undefined}
            />
          )
        })}

        <div className={cnEditFeatureGeometry('GroupFooter')}>
          <EditFeatureGeometryAsText coordinates={coordinates} />

          {canBeDeleted ? (
            <EditFeatureGeometryDelButton onClick={this.deleteGroupHandler}>
              Удалить контур/линию
            </EditFeatureGeometryDelButton>
          ) : null}
          
          <EditFeatureGeometryAddButton onClick={this.addHandler}>
            Добавить узел
          </EditFeatureGeometryAddButton>
        </div>

      </Tag>
    );
  }

  @action
  private deleteHandler (i: number) {
    this.props.coordinates.splice(i, 1);
  }

  @action
  private addHandler () {
    this.props.coordinates.push(['', '']);
  }

  private deleteGroupHandler () {
    const { onDelete, index } = this.props;
    onDelete(index);
  }
}
