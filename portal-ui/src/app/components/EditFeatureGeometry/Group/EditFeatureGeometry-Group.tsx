import React, { Component, ComponentType, createRef, PropsWithChildren } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { debounce } from 'lodash';

import { CoordinateEdited } from '../../../services/geoserver/wfs/wfs.models';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { EditFeatureGeometryStore } from '../../../stores/EditFeatureGeometry.store';
import { EditFeatureGeometryAddNode } from '../AddNode/EditFeatureGeometry-AddNode';
import { EditFeatureGeometryAsText } from '../AsText/EditFeatureGeometry-AsText';
import { EditFeatureGeometryCoord } from '../Coord/EditFeatureGeometry-Coord';
import { EditFeatureGeometryCSV } from '../CSV/EditFeatureGeometry-CSV';
import { EditFeatureGeometryDelButton } from '../DelButton/EditFeatureGeometry-DelButton';
import { EditFeatureGeometryGroupFooter } from '../GroupFooter/EditFeatureGeometry-GroupFooter';
import { EditFeatureGeometryGroupInner } from '../GroupInner/EditFeatureGeometry-GroupInner';
import { EditFeatureGeometryXY } from '../XY/EditFeatureGeometry-XY';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Group.scss';

export const cnEditFeatureGeometryGroup = cn('EditFeatureGeometry', 'Group');

export type ContainerProps = PropsWithChildren<IClassNameProps>;

export interface EditFeatureGeometryGroupProps extends IClassNameProps {
  coordinates: CoordinateEdited[];
  minCoordsCount: number;
  mustBeClosed?: boolean;
  canBeDeleted: boolean;
  onDelete?: (index: number) => void;
  Container?: ComponentType<ContainerProps>;
  multiple: boolean;
  index: number;
  store: EditFeatureGeometryStore;
}

const COORD_HEIGHT = 39;
const COORDS_IN_VIEWPORT = 15;

const Div = (props: ContainerProps) => <div {...props} />;

@observer
export class EditFeatureGeometryGroup extends Component<EditFeatureGeometryGroupProps> {
  @observable private startOffset: number;
  @observable private endOffset: number;
  private innerRef = createRef<HTMLDivElement>();

  constructor(props: EditFeatureGeometryGroupProps) {
    super(props);

    makeObservable(this);

    this.calcOffsets(0);
    this.calcOffsets = debounce(this.calcOffsets, 100);
  }

  render() {
    const { coordinates, minCoordsCount, canBeDeleted, className, Container, mustBeClosed, store, index } = this.props;
    const Tag = Container || Div;

    return (
      <Tag className={cnEditFeatureGeometryGroup(null, [className])}>
        <EditFeatureGeometryXY />

        <EditFeatureGeometryGroupInner
          coordHeight={COORD_HEIGHT}
          coordsInViewport={COORDS_IN_VIEWPORT}
          startOffset={this.startOffset}
          endOffset={this.endOffset}
          onScroll={this.scrollHandler}
          innerRef={this.innerRef}
        >
          {coordinates.slice(this.startOffset, coordinates.length - this.endOffset).map((coordinate, i) => {
            const isLast = i + this.startOffset === coordinates.length - 1;

            return (
              <EditFeatureGeometryCoord
                store={store}
                val={coordinate}
                key={i + this.startOffset}
                index={i + this.startOffset}
                onDelete={this.deleteHandler}
                withControls
                canBeDeleted={coordinates.length > minCoordsCount}
                disabled={isLast && mustBeClosed}
                onChange={this.changeHandler}
              />
            );
          })}
        </EditFeatureGeometryGroupInner>

        <EditFeatureGeometryGroupFooter>
          <EditFeatureGeometryAddNode onClick={this.addHandler} />
          <EditFeatureGeometryAsText
            coordinates={coordinates}
            mustBeClosed={mustBeClosed}
            geometryType={store.geometryType}
            first={!index}
          />
          <EditFeatureGeometryCSV
            coordinates={coordinates}
            empty={this.empty}
            mustBeClosed={mustBeClosed}
            geometryType={store.geometryType}
            first={!index}
          />
          {canBeDeleted ? (
            <EditFeatureGeometryDelButton
              onClick={this.deleteGroupHandler}
              labelToDelete={selectLabelForGeometryType(
                store.geometryType,
                `контур${index ? ' (вырезку)' : ''}`,
                'линию',
                'группу'
              )}
            />
          ) : null}
        </EditFeatureGeometryGroupFooter>
      </Tag>
    );
  }

  @computed
  private get empty() {
    return !this.props.coordinates.flat(5).some(Boolean);
  }

  @action.bound
  private deleteHandler(i: number) {
    const { mustBeClosed, coordinates } = this.props;

    coordinates.splice(i, 1);

    if (i === 0 && mustBeClosed) {
      coordinates[coordinates.length - 1] = coordinates[0];
    }

    this.calcOffsets();
  }

  @action.bound
  private addHandler() {
    const { coordinates, mustBeClosed } = this.props;
    const where = coordinates.length - (mustBeClosed ? 1 : 0);
    coordinates.splice(where, 0, ['', '']);
    this.calcOffsets();
  }

  @boundMethod
  private deleteGroupHandler() {
    const { onDelete, index } = this.props;
    onDelete(index);
  }

  @action.bound
  private changeHandler(val: CoordinateEdited, i: number) {
    const { mustBeClosed, coordinates } = this.props;

    coordinates[i] = val;
    if (i === 0 && mustBeClosed) {
      coordinates[coordinates.length - 1] = val;
    }

    this.calcOffsets();
  }

  @boundMethod
  private scrollHandler() {
    this.calcOffsets();
  }

  @action
  private calcOffsets(scrollTop?: number) {
    if (scrollTop === undefined) {
      scrollTop = this.innerRef.current.scrollTop;
    }
    const padding = 5;
    this.startOffset = Math.max(0, Math.ceil(scrollTop / COORD_HEIGHT - padding));
    this.endOffset = Math.max(0, this.props.coordinates.length - this.startOffset - COORDS_IN_VIEWPORT - padding * 2);
  }
}
