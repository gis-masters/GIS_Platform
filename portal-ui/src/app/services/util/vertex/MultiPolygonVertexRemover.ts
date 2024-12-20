import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry, LinearRing, MultiPolygon, Polygon } from 'ol/geom';

import { VertexRemover } from './vertex-models';

export class MultiPolygonVertexRemover implements VertexRemover {
  removeVertex(feature: Feature<Geometry>, vertex: Coordinate): void {
    const multiPolygon: Geometry | undefined = feature.getGeometry();
    if (!(multiPolygon instanceof MultiPolygon)) {
      return;
    }

    const result: MultiPolygon = new MultiPolygon([]);
    multiPolygon.getPolygons().forEach(polygon => {
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

      result.appendPolygon(resultPolygon);
    });

    feature.setGeometry(result);
  }
}
