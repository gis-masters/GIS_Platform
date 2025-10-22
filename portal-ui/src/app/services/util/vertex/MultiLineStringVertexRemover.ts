import { type Feature } from 'ol';
import { type Coordinate } from 'ol/coordinate';
import { type Geometry, MultiLineString } from 'ol/geom';
import LineString from 'ol/geom/LineString';

import { type VertexRemover } from './vertex-models';

export class MultiLineStringVertexRemover implements VertexRemover {
  removeVertex(feature: Feature<Geometry>, vertex: Coordinate): void {
    const multiLine = feature.getGeometry();
    if (!(multiLine instanceof MultiLineString)) {
      return;
    }

    const result: MultiLineString = new MultiLineString([]);
    multiLine.getLineStrings().forEach(line => {
      const coordinates = line.getCoordinates();
      if (coordinates.length <= 2) {
        result.appendLineString(line);

        return;
      }

      result.appendLineString(
        new LineString(coordinates.filter(coord => coord[0] !== vertex[0] || coord[1] !== vertex[1]))
      );
    });

    feature.setGeometry(result);
  }
}
