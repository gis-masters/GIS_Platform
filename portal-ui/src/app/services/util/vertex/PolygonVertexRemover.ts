import { type Feature } from 'ol';
import { type Coordinate } from 'ol/coordinate';
import { type Geometry, LinearRing, Polygon } from 'ol/geom';

import { type VertexRemover } from './vertex-models';

export class PolygonVertexRemover implements VertexRemover {
  removeVertex(feature: Feature<Geometry>, vertex: Coordinate): void {
    const polygon: Geometry | undefined = feature.getGeometry();
    if (!(polygon instanceof Polygon)) {
      return;
    }

    const resultPolygon: Polygon = new Polygon([]);

    polygon.getLinearRings().forEach(ring => {
      const coordinates = ring.getCoordinates();
      if (coordinates.length <= 4) {
        resultPolygon.appendLinearRing(ring);

        return;
      }

      const before = coordinates.length;
      const cleared = coordinates.filter(coord => coord[0] !== vertex[0] || coord[1] !== vertex[1]);
      const after = cleared.length;
      // В случае удаления координаты замыкающей полигон, мы должны замкнуть его заново.
      if (before - after === 2) {
        cleared.push(cleared[0]);
      }

      resultPolygon.appendLinearRing(new LinearRing(cleared));
    });

    feature.setGeometry(resultPolygon);
  }
}
