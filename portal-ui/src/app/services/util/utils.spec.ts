import {GeoUtil} from './GeoUtil';
import {EntityTypesUtil} from "./EntityTypesUtil";
import {ImportTask} from '../geoserver/import.service';
import {EntityType} from "../gis/rules.service";

describe('GeoUtil test', () => {

  it('should convert ImportTask to ImportTasks', () => {
    const task1 = {id: 1, href: 'first', state: 'ready'};
    const task2 = {id: 2, href: 'second', state: 'ready'};
    const task3 = {id: 3, href: 'third', state: 'ready'};
    const tasks = [task1, task2];

    const importTask_case1 = {
      tasks: tasks,
      task: undefined
    } as ImportTask;

    const importTasks_case1 = GeoUtil.tasksHandler(importTask_case1);
    expect(2).toEqual(importTasks_case1.tasks.length);

    const importTask_case2 = {
      tasks: undefined,
      task: task3
    } as ImportTask;

    const importTasks = GeoUtil.tasksHandler(importTask_case2);
    expect(1).toEqual(importTasks.tasks.length);
    expect(3).toEqual(importTasks.tasks[0].id);
  });

  it('should convert all url to GatewayAPI Url', () => {
    const url1 = 'http://localhost:8080/geoserver/rest/imports';
    const url2 = 'http://gateway:8314/geoserver';
    const url3 = 'http://one_more_url_withOut_port/any';
    const url4 = 'https://https_url/any';

    expect('http://anyHost:8100/geoserver/rest/imports').toEqual(GeoUtil.replaceUrl(url1, {host: 'anyHost', port: 8100}));
    expect('http://anyOtherHost:8100/geoserver').toEqual(GeoUtil.replaceUrl(url2, {host: 'anyOtherHost', port: 8100}));
    expect('http://localhost:8100/any').toEqual(GeoUtil.replaceUrl(url3, {host: 'localhost', port: 8100}));
    expect('https://192.168.100.100:8100/any').toEqual(GeoUtil.replaceUrl(url4, {host: '192.168.100.100', port: 8100}));
  });

  it('should correct mapping geometry between Layer and EntityType', () => {
    let entityPoint: EntityType = {
      name: 'SomeName',
      title: '',
      description: '',
      properties: [{
          name: 'geometry',
          title: '',
          valueType: 'GEOMETRY',
          allowedValues: [
            'Point'
          ]
        }
      ],
      tableName: ''
    };

    let entityLineString: EntityType = {
      name: 'SomeName',
      title: '',
      description: '',
      properties: [{
          name: 'geometry',
          title: '',
          valueType: 'GEOMETRY',
          allowedValues: [
            'LineString'
          ]
        }
      ],
      tableName: ''
    };

    let entityPolygon: EntityType = {
      name: 'SomeName',
      title: '',
      description: '',
      properties: [{
          name: 'geometry',
          title: '',
          valueType: 'GEOMETRY',
          allowedValues: [
            'Polygon'
          ]
        }
      ],
      tableName: ''
    };

    let entityMultiGeometry: EntityType = {
      name: 'SomeName',
      title: '',
      description: '',
      properties: [{
          name: 'geometry',
          title: '',
          valueType: 'GEOMETRY',
          allowedValues: [
            'Polygon',
            'Curve'
          ]
        }
      ],
      tableName: ''
    };

    expect(true).toEqual(EntityTypesUtil.isLayerGeometryCompatible('Point', entityPoint));
    expect(false).toEqual(EntityTypesUtil.isLayerGeometryCompatible('-Point-', entityPoint));
    expect(true).toEqual(EntityTypesUtil.isLayerGeometryCompatible('MultiLineString', entityLineString));
    expect(false).toEqual(EntityTypesUtil.isLayerGeometryCompatible('Polygon', entityLineString));
    expect(true).toEqual(EntityTypesUtil.isLayerGeometryCompatible('MultiPolygon', entityPolygon));
    expect(false).toEqual(EntityTypesUtil.isLayerGeometryCompatible('MultiLineString', entityMultiGeometry));
  });

});
