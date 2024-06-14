import React, { CSSProperties, FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-GroupInner.scss';

const cnEditFeatureGeometryGroupInner = cn('EditFeatureGeometry', 'GroupInner');

interface EditFeatureGeometryGroupInnerProps extends ChildrenProps {
  coordHeight: number;
  coordsInViewport: number;
  startOffset: number;
  endOffset: number;
  innerRef: RefObject<HTMLDivElement>;
  onScroll(e: React.UIEvent<HTMLDivElement>): void;
}

export const EditFeatureGeometryGroupInner: FC<EditFeatureGeometryGroupInnerProps> = props => {
  const { coordHeight, startOffset, endOffset, onScroll, coordsInViewport, children, innerRef } = props;
  const style: CSSProperties = {
    '--EditFeatureGeometryCoordHeight': coordHeight,
    '--EditFeatureGeometryCoordsInViewport': coordsInViewport,
    '--EditFeatureGeometryGroupStartOffset': startOffset,
    '--EditFeatureGeometryGroupEndOffset': endOffset
  };

  return (
    <div className={cnEditFeatureGeometryGroupInner(null, ['scroll'])} style={style} onScroll={onScroll} ref={innerRef}>
      {children}
    </div>
  );
};
