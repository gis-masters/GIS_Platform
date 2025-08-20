import React, { Component, ComponentType, createRef, PropsWithChildren } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { debounce } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { selectLabelForGeometryType } from '../../../services/geoserver/wfs/wfs.util';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
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
  coordinates: Coordinate[];
  minCoordsCount: number;
  mustBeClosed?: boolean;
  canBeDeleted: boolean;
  Container?: ComponentType<ContainerProps>;
  multiple: boolean;
  index: number;
  startIndex?: number;
  onDelete?(index: number): void;
}

const COORD_HEIGHT = 39;
const COORDS_IN_VIEWPORT = 15;

const Div = (props: ContainerProps) => <div {...props} />;

@observer
export class EditFeatureGeometryGroupBase extends Component<EditFeatureGeometryGroupProps> {
  @observable private startOffset: number;
  @observable private endOffset: number;
  private innerRef = createRef<HTMLDivElement>();

  constructor(props: EditFeatureGeometryGroupProps) {
    super(props);

    makeObservable(this);

    const [startOffset, endOffset] = this.getOffsets(0);

    this.startOffset = startOffset;
    this.endOffset = endOffset;

    this.updateOffsets = debounce(this.updateOffsets, 100);
  }

  render() {
    const {
      coordinates,
      canBeDeleted,
      minCoordsCount,
      className,
      Container,
      mustBeClosed = false,
      index,
      startIndex = 0
    } = this.props;

    const Tag = Container || Div;

    if (!editFeatureStore.geometryType) {
      return null;
    }

    return (
      <Tag className={cnEditFeatureGeometryGroup(null, [className])}>
        <Paper elevation={2}>
          <EditFeatureGeometryXY />

          <EditFeatureGeometryGroupInner
            coordHeight={COORD_HEIGHT}
            coordsInViewport={COORDS_IN_VIEWPORT}
            startOffset={this.startOffset}
            endOffset={this.endOffset}
            onScroll={this.handleScroll}
            innerRef={this.innerRef}
          >
            {coordinates.slice(this.startOffset, coordinates.length - this.endOffset).map((coordinate, i) => {
              const isLast = i + this.startOffset === coordinates.length - 1;
              let displayIndex = i + this.startOffset;

              if (
                editFeatureStore.geometryType === GeometryType.MULTI_POLYGON ||
                editFeatureStore.geometryType === GeometryType.POLYGON
              ) {
                displayIndex = isLast ? startIndex || index : startIndex + i + this.startOffset;
              }

              if (editFeatureStore.geometryType === GeometryType.MULTI_LINE_STRING) {
                displayIndex = startIndex + i + this.startOffset;
              }

              return (
                <EditFeatureGeometryCoord
                  val={coordinate}
                  key={i + this.startOffset}
                  displayIndex={displayIndex}
                  index={i}
                  onDelete={this.handleDelete}
                  withControls
                  canBeDeleted={coordinates.length > minCoordsCount}
                  disabled={isLast && mustBeClosed}
                  onChange={this.handleChange}
                />
              );
            })}
          </EditFeatureGeometryGroupInner>

          <EditFeatureGeometryGroupFooter>
            <EditFeatureGeometryAddNode onClick={this.handleAdd} />
            <EditFeatureGeometryAsText
              coordinates={coordinates}
              mustBeClosed={mustBeClosed}
              geometryType={editFeatureStore.geometryType}
              first={!index}
            />
            <EditFeatureGeometryCSV
              coordinates={coordinates}
              empty={this.empty}
              mustBeClosed={mustBeClosed}
              geometryType={editFeatureStore.geometryType}
              first={!index}
            />
            {canBeDeleted ? (
              <EditFeatureGeometryDelButton
                onClick={this.handleGroupDeleting}
                labelToDelete={selectLabelForGeometryType(
                  editFeatureStore.geometryType,
                  `контур${index ? ' (вырезку)' : ''}`,
                  'линию',
                  'группу'
                )}
              />
            ) : null}
          </EditFeatureGeometryGroupFooter>
        </Paper>
      </Tag>
    );
  }

  @computed
  private get empty() {
    return !this.props.coordinates.flat(5).some(Boolean);
  }

  @action.bound
  private handleDelete(i: number) {
    const { mustBeClosed, coordinates } = this.props;

    coordinates.splice(i, 1);

    if (i === 0 && mustBeClosed) {
      coordinates[coordinates.length - 1] = coordinates[0];
    }

    this.updateOffsets();
  }

  @action.bound
  private handleAdd() {
    const { coordinates, mustBeClosed } = this.props;
    const where = coordinates.length - (mustBeClosed ? 1 : 0);
    coordinates.splice(where, 0, [0, 0]);
    this.updateOffsets();
  }

  @boundMethod
  private handleGroupDeleting() {
    const { onDelete, index } = this.props;
    onDelete?.(index);
  }

  @action.bound
  private handleChange(val: Coordinate, i: number) {
    const { mustBeClosed, coordinates } = this.props;

    coordinates[i] = val;
    if (i === 0 && mustBeClosed) {
      coordinates[coordinates.length - 1] = val;
    }

    this.updateOffsets();
  }

  @boundMethod
  private handleScroll() {
    this.updateOffsets();
  }

  @action
  private updateOffsets(scrollTop?: number) {
    if (scrollTop === undefined) {
      scrollTop = this.innerRef.current?.scrollTop || 0;
    }

    const [startOffset, endOffset] = this.getOffsets(scrollTop);

    this.startOffset = startOffset;
    this.endOffset = endOffset;
  }

  private getOffsets(scrollTop: number): [number, number] {
    const padding = 5;
    const startOffset = Math.max(0, Math.ceil(scrollTop / COORD_HEIGHT - padding));
    const endOffset = Math.max(0, this.props.coordinates.length - startOffset - COORDS_IN_VIEWPORT - padding * 2);

    return [startOffset, endOffset];
  }
}
