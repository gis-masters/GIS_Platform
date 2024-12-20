import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';

export interface VertexRemover {
  removeVertex(feature: Feature, vertex: Coordinate): void;
}
