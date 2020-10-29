import {LayerAttribute} from './models';
import {ImportTargetType} from '../../models';

// Править в соответствии с моделью ru/mycrg/gis/service/import_/ImportTask.java
export class TaskImport {
  // Наименование слоя из исходных данных
  layerName: string;

  // Название проекта
  workTableName: string;

  // Список сопоставлемых атрибутов
  pairs: MatchingPair[] = [];

  // Система координат определенная импорт плагином
  srs: number;

  schemaName: string;

  constructor(layerName: string, srs: string) {
    this.srs = Number(srs.split(':')[1]);
    this.layerName = layerName;
  }

  isPrepared(): boolean {
    if (!this.layerName || !this.workTableName || this.pairs.length < 1) {
      return false;
    }

    return true;
  }
}

export interface MatchingPair {
  source: LayerAttribute;
  target: ColumnProjection;
}

export interface ColumnProjection {
  name: string;
  type: ImportTargetType;
}
