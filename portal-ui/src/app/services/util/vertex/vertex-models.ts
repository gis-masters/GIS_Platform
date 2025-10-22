import { type Coordinate } from 'ol/coordinate';
import type Feature from 'ol/Feature';

export interface VertexRemover {
  removeVertex(feature: Feature, vertex: Coordinate): void;
}
