import {forkJoin} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AS_IS_TYPE, ImportLayer, MappingItem, TaskImport} from './import.service';

/**
 * Класс не используется поскольку решили делать импорт в рабочее хранилище самостоятельно без импорт плагина.
 * Импорт плагин используется только для первичного импорта во временное хранилище.
 */
@Injectable({
  providedIn: 'root'
})
export class TransformationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger) {

  }

  addLayersTransformations(layers: ImportLayer[], tasks: TaskImport[]) {
    this.logger.info('Add transformation for ' + layers.length + ' layers');

    const observableTasks = [];
    layers.forEach((layer: ImportLayer) => {
      const task = tasks.find((_task: TaskImport) => _task.layerName === layer.layer.originalName);

      observableTasks.push(this.addLayerTransformation(layer, task.mapping));
    });

    return forkJoin(observableTasks);
  }

  addLayerTransformation(layer: ImportLayer, transforms: MappingItem[]) {
    this.logger.info('Add transformation for layer: ' + layer.layer.originalName, transforms);

    const observableTasks = [];
    transforms.forEach((transform: MappingItem) => {
      // if (!(transform.target.type === 'NotImport' || transform.target.type === AS_IS_TYPE.type || transform.target.name === 'objectid')) {
      //   observableTasks.push(this.addTransformation(layer.layer.href, transform));
      // }
    });

    return forkJoin(observableTasks);
  }

  private addTransformation(layerHref: string, transform: MappingItem) {
    const url = layerHref.split('layer')[0] + 'transforms';

    const payload = {
      type: 'AttributeComputeTransform',
      field: transform.target.name,
      // fieldType: this.getFieldType(transform.target.type),
      cql: transform.source.name
    };

    return this.http.post(url, payload);
  }

  // {dbType: 'int2', fieldType: 'java.lang.Integer'},
  // {dbType: 'int4', fieldType: 'java.lang.Long'},
  // {dbType: 'varchar', fieldType: 'java.lang.String'},
  // {dbType: 'numeric', fieldType: 'java.lang.Double'},

  private getFieldType(value: string): string {
    if ('int2' === value) { return 'java.lang.Integer'; }
    if ('int4' === value) { return 'java.lang.Long'; }
    if ('varchar' === value) { return 'java.lang.String'; }
    if ('numeric' === value) { return 'java.lang.Double'; }
    if ('geometry' === value) { return 'org.locationtech.jts.geom.MultiPolygon'; }
  }

}
