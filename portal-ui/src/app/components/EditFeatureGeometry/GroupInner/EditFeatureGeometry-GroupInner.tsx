import React, { FC, RefObject, CSSProperties } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-GroupInner.scss';

const cnEditFeatureGeometryGroupInner = cn('EditFeatureGeometry', 'GroupInner');

interface EditFeatureGeometryGroupInnerProps {
  coordHeight: number;
  coordsInViewport: number;
  startOffset: number;
  endOffset: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  innerRef: RefObject<HTMLDivElement>;
}

export const EditFeatureGeometryGroupInner: FC<EditFeatureGeometryGroupInnerProps> = props => {
  const { coordHeight, startOffset, endOffset, onScroll, coordsInViewport, children, innerRef } = props;
  const style = {
    '--EditFeatureGeometryCoordHeight': coordHeight,
    '--EditFeatureGeometryCoordsInViewport': coordsInViewport,
    '--EditFeatureGeometryGroupStartOffset': startOffset,
    '--EditFeatureGeometryGroupEndOffset': endOffset
  } as CSSProperties;

  return (
    <div className={cnEditFeatureGeometryGroupInner(null, ['scroll'])} style={style} onScroll={onScroll} ref={innerRef}>
      {children}
    </div>
  );
};
