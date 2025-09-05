import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry } from 'ol/geom';
import LineString from 'ol/geom/LineString';

import { VertexRemover } from './vertex-models';

export class LineStringVertexRemover implements VertexRemover {
  removeVertex(feature: Feature<Geometry>, vertex: Coordinate): void {
    const line = feature.getGeometry();
    if (!(line instanceof LineString)) {
      return;
    }

    const coordinates = line.getCoordinates();

    // Проверяем, что после удаления вершины останется минимум 2 точки
    if (coordinates.length <= 2) {
      return; // Не удаляем вершину, если это приведет к невалидной геометрии
    }

    // Фильтруем координаты, исключая указанную вершину
    const filteredCoordinates = coordinates.filter(coord => coord[0] !== vertex[0] || coord[1] !== vertex[1]);

    // Создаем новую LineString с отфильтрованными координатами
    const newLine = new LineString(filteredCoordinates);

    feature.setGeometry(newLine);
  }
}
