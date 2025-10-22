import { type Feature } from 'ol';
import { type Coordinate } from 'ol/coordinate';
import { type Geometry } from 'ol/geom';

import { services } from '../../services';
import { type VertexRemover } from './vertex-models';

export class MultiPointVertexRemover implements VertexRemover {
  removeVertex(feature: Feature<Geometry>, vertex: Coordinate): void {
    services.logger.info('Удаление вершин для MultiPoint не реализовано', feature, vertex);
  }
}
