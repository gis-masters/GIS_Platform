import {GeoUtil} from './GeoUtil';
import {ImportTask} from '../geoserver/import/models';
import {FeatureDescription} from '../crg/data-schema.service';
import {FeatureUtil} from './FeatureUtil';

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

    expect('http://anyHost:8100/geoserver/rest/imports').toEqual(GeoUtil.replaceUrl(url1, {
      host: 'anyHost',
      port: 8100
    }));
    expect('http://anyOtherHost:8100/geoserver').toEqual(GeoUtil.replaceUrl(url2, {host: 'anyOtherHost', port: 8100}));
    expect('http://localhost:8100/any').toEqual(GeoUtil.replaceUrl(url3, {host: 'localhost', port: 8100}));
    expect('https://192.168.100.100:8100/any').toEqual(GeoUtil.replaceUrl(url4, {host: '192.168.100.100', port: 8100}));
  });

  it('should correct mapping geometry between Layer and EntityType', () => {
    const entityPoint: FeatureDescription = {
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

    const entityLineString: FeatureDescription = {
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

    const entityPolygon: FeatureDescription = {
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

    const entityMultiGeometry: FeatureDescription = {
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

    expect(true).toEqual(FeatureUtil.isFeatureGeometryCompatible('Point', entityPoint));
    expect(false).toEqual(FeatureUtil.isFeatureGeometryCompatible('-Point-', entityPoint));
    expect(true).toEqual(FeatureUtil.isFeatureGeometryCompatible('MultiLineString', entityLineString));
    expect(false).toEqual(FeatureUtil.isFeatureGeometryCompatible('Polygon', entityLineString));
    expect(true).toEqual(FeatureUtil.isFeatureGeometryCompatible('MultiPolygon', entityPolygon));
    expect(false).toEqual(FeatureUtil.isFeatureGeometryCompatible('MultiLineString', entityMultiGeometry));
  });

  it('should check custom rules', () => {
    const object1 = {
      classid: 602050202,
      fp_type: 1,
      status: 1
    };

    const result1 = customRule(object1);
    expect(true).toEqual(result1.some(item => item.name === 'status'));
    expect(true).toEqual(result1.some(item => item.type === 'must_be_empty'));

    const object2 = {
      classid: 604010104,
      fp_type: 1,
      status: 1
    };

    const result2 = customRule(object2);
    expect(true).toEqual(result2.some(item => item.name === 'fp_type'));
    expect(true).toEqual(result2.some(item => item.type === 'must_be_empty'));
  });

});

function customRule(obj) {
  var errors = [];

  // В приказе - "Н"
  if (!(obj.classid == '604010103' || obj.classid == '604010104')) {
    if (obj.status) {
      errors.push({name: 'status', type: 'must_be_empty'});
    }
  }

  // В приказе - "У"
  if (obj.classid == '602050202') {
    if (!obj.fp_type) {
      errors.push({name: 'fp_type', type: 'required'});
    }
  } else if (obj.fp_type) {
    errors.push({name: 'fp_type', type: 'must_be_empty'});
  }

  return errors;
}

function functionalZoneCustomRule(obj) {
var errors = [];

if (obj.classid == '701010301') {
  if (!obj.fz_mfstp) {
    errors.push({name: 'fz_mfstp', type: 'required'});
  }
} else if (obj.fz_mfstp) {
  errors.push({name: 'fz_mfstp', type: 'must_be_empty'});
}

if (obj.classid == '701010302') {
  if (!obj.fz_odstp) {
    errors.push({name: 'fz_odstp', type: 'required'});
  }
} else if (obj.fz_odstp) {
  errors.push({name: 'fz_odstp', type: 'must_be_empty'});
}

if (obj.classid == '701010404') {
  if (!obj.fz_ingstp) {
    errors.push({name: 'fz_ingstp', type: 'required'});
  }
} else if (obj.fz_ingstp) {
  errors.push({name: 'fz_ingstp', type: 'must_be_empty'});
}

if (obj.classid == '701010405') {
  if (!obj.fz_trstp) {
    errors.push({name: 'fz_trstp', type: 'required'});
  }
} else if (obj.fz_trstp) {
  errors.push({name: 'fz_trstp', type: 'must_be_empty'});
}

if (obj.classid == '701010504') {
  if (!obj.fz_shstp) {
    errors.push({name: 'fz_shstp', type: 'required'});
  }
} else if (obj.fz_shstp) {
  errors.push({name: 'fz_shstp', type: 'must_be_empty'});
}

if (obj.classid == '701010602') {
  if (!obj.fz_recstp) {
    errors.push({name: 'fz_recstp', type: 'required'});
  }
} else if (obj.fz_recstp) {
  errors.push({name: 'fz_recstp', type: 'must_be_empty'});
}

if (obj.classid == '701010606') {
  if (!obj.fz_orecstp) {
    errors.push({name: 'fz_orecstp', type: 'required'});
  }
} else if (obj.fz_orecstp) {
  errors.push({name: 'fz_orecstp', type: 'must_be_empty'});
}

if (!(obj.classid == 701010100 || obj.classid == 701010101 ||
      obj.classid == 701010102 || obj.classid == 701010103 ||
      obj.classid == 701010104 || obj.classid == 701010200 ||
      obj.classid == 701010300 || obj.classid == 701010301 ||
      obj.classid == 701010302 || obj.classid == 701010303)) {
  if (obj.pop_den) {
    errors.push({name: 'pop_den', type: 'must_be_empty'});
  }

  if (obj.population) {
    errors.push({name: 'population', type: 'must_be_empty'});
  }
}

if (obj.status == '2' || obj.status == '3' || obj.status == '4') {
  if (!obj.event_time) {
    errors.push({name: 'event_time', type: 'required'});
  }
} else if (obj.event_time) {
  errors.push({name: 'event_time', type: 'must_be_empty'});
}

if (obj.status == '2') {
  if (!obj.reg_status) {
    errors.push({name: 'reg_status', type: 'required'});
  }
} else if (obj.reg_status) {
  errors.push({name: 'reg_status', type: 'must_be_empty'});
}

return errors;
}
