import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry } from 'ol/geom';

import { services } from '../../services';
import { VertexRemover } from './vertex-models';

export class MultiPointVertexRemover implements VertexRemover {
  removeVertex(feature: Feature<Geometry>, vertex: Coordinate): void {
    services.logger.info('Удаление вершин для MultiPoint не реализовано', feature, vertex);
  }
}
