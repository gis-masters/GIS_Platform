import React, { Component, ComponentType, PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import { IClassNameProps } from '@bem-react/core'

import { CoordinateEdited } from '../../../services/geoserver/wfs-models';
import { transformDimension } from '../../../services/geoserver/wfs.service';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';

import { EditFeatureGeometryXY } from '../XY/EditFeatureGeometry-XY';
import { EditFeatureGeometryCoord } from '../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryGroupFooter } from '../GroupFooter/EditFeatureGeometry-GroupFooter';
import { EditFeatureGeometryAddNode } from '../AddNode/EditFeatureGeometry-AddNode';
import { EditFeatureGeometryAsText } from '../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryDraw } from '../Draw/EditFeatureGeometry-Draw';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Group.scss';

export type ContainerProps = PropsWithChildren<IClassNameProps>;

export interface EditFeatureGeometryGroupProps extends IClassNameProps {
  coordinates: CoordinateEdited[];
  minCoordsCount: number;
  mustBeClosed?: boolean;
  canBeDeleted: boolean;
  onDelete: (index: number) => void;
  Container?: ComponentType<ContainerProps>;
  multiple: boolean;
  index: number;
  store: EditFeatureGeometryStore;
}

const Div = ((props: ContainerProps) => <div {...props} />);

@observer
export class EditFeatureGeometryGroup extends Component<EditFeatureGeometryGroupProps> {
  constructor (props: EditFeatureGeometryGroupProps) {
    super(props);

    this.deleteHandler = this.deleteHandler.bind(this);
    this.addHandler = this.addHandler.bind(this);
    this.deleteGroupHandler = this.deleteGroupHandler.bind(this);
  }

  render () {
    const { coordinates, minCoordsCount, canBeDeleted, className, Container, mustBeClosed, store } = this.props;
    const Tag = Container || Div;

    return (
      <Tag className={className}>
        <EditFeatureGeometryXY />

        {coordinates.map((coordinate, i) => {
          const isLast = i === coordinates.length - 1;

          return (
            <EditFeatureGeometryCoord
                store={store}
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

        <EditFeatureGeometryGroupFooter>
          <EditFeatureGeometryAddNode onClick={this.addHandler} />
          <EditFeatureGeometryAsText coordinates={coordinates} />
          {this.empty ? <EditFeatureGeometryDraw coordinates={coordinates} store={store} /> : null}
          {canBeDeleted ? <EditFeatureGeometryDelButton onClick={this.deleteGroupHandler} /> : null}
        </EditFeatureGeometryGroupFooter>
      </Tag>
    );
  }

  @computed
  private get empty () {
    return !this.props.coordinates.flat(5).some(coord => coord);
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
