import Feature from 'ol/Feature';

import { services } from '../../services';
import { LineStringVertexRemover } from './LineStringVertexRemover';
import { MultiLineStringVertexRemover } from './MultiLineStringVertexRemover';
import { MultiPointVertexRemover } from './MultiPointVertexRemover';
import { MultiPolygonVertexRemover } from './MultiPolygonVertexRemover';
import { PolygonVertexRemover } from './PolygonVertexRemover';
import { VertexRemover } from './vertex-models';

export function getVertexRemover(feature: Feature): VertexRemover | null {
  if (feature === undefined || feature.getGeometry() === undefined) {
    services.logger.warn('Не найден обработчик вершин. Задана не корректная фича');

    return null;
  }

  const type = feature.getGeometry()?.getType();
  switch (type) {
    case 'MultiPoint': {
      return new MultiPointVertexRemover();
    }
    case 'LineString': {
      return new LineStringVertexRemover();
    }
    case 'MultiLineString': {
      return new MultiLineStringVertexRemover();
    }
    case 'Polygon': {
      return new PolygonVertexRemover();
    }
    case 'MultiPolygon': {
      return new MultiPolygonVertexRemover();
    }
    default: {
      services.logger.warn(`Не поддерживается обработка вершин для типа '${type}'`);

      return null;
    }
  }
}
