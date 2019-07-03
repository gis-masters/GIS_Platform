import {Util} from './util';
import {WfsFeature, WfsGeometry} from '../../services/geoserver/wfs.service';
import {EditFeatureMode} from '../edit-feature/edit-feature.component';

describe('Test for Multiple edit feature', () => {

  it('should prepare data for multiple edit', () => {

    const features: WfsFeature[] = [
      {
        'type': 'Feature',
        'id': 'functionalzone.2',
        'geometry': undefined,
        'geometry_name': 'shape',
        'properties': {
          'classid': 701010605,
          'fz_mfstp': 3,
          'fz_odstp': 0,
          'fz_ingstp': 0,
          'fz_trstp': 0,
          'fz_shstp': 0,
          'fz_recstp': 0,
          'fz_orecstp': 0,
          'area': 3642.69431848,
          'info_obj': '',
          'constr_den': 0,
          'bld_height': 0,
          'pop_den': 0,
          'population': 0,
          'hzrd_class': 0,
          'other': '',
          'event_time': 0,
          'status': 1,
          'reg_status': 2,
          'globalid': '{BE022BB0-9670-49CE-80A6-2853A13301AE}',
          'shape_leng': 43131.0342883,
          'shape_area': 36426943.1848,
          'bbox': [3780405.255, 5529473.9613, 3792313.1804, 5540204.3345]
        }
      },
      {
        'type': 'Feature',
        'id': 'functionalzone.4',
        'geometry': undefined,
        'geometry_name': 'shape',
        'properties': {
          'classid': 701010605,
          'fz_mfstp': 0,
          'fz_odstp': 1,
          'fz_ingstp': 1,
          'fz_trstp': 0,
          'fz_shstp': 0,
          'fz_recstp': 0,
          'fz_orecstp': 0,
          'area': 3122.16089975,
          'info_obj': '',
          'constr_den': 0,
          'bld_height': 0,
          'pop_den': 0,
          'population': 0,
          'hzrd_class': 0,
          'other': '',
          'event_time': 0,
          'status': 2,
          'reg_status': 4,
          'globalid': '{D7FA9F8F-AC94-407C-89F5-3DB2191D706B}',
          'shape_leng': 69106.5759492,
          'shape_area': 31221608.9975,
          'bbox': [3789952.6276, 5537376.0942, 3802420.8633, 5552361.1377]
        }
      },
      {
        'type': 'Feature',
        'id': 'functionalzone.8',
        'geometry': undefined,
        'geometry_name': 'shape',
        'properties': {
          'classid': 701010605,
          'fz_mfstp': 0,
          'fz_odstp': 0,
          'fz_ingstp': 0,
          'fz_trstp': 0,
          'fz_shstp': 0,
          'fz_recstp': 0,
          'fz_orecstp': 0,
          'area': 2768.69881069,
          'info_obj': '',
          'constr_den': 0,
          'bld_height': 0,
          'pop_den': 1,
          'population': 0,
          'hzrd_class': 0,
          'other': '5',
          'event_time': 0,
          'status': 1,
          'reg_status': 4,
          'globalid': '{999F449B-1FDC-4A34-8725-B8EC402CECDE}',
          'shape_leng': 52052.7090549,
          'shape_area': 27686988.1069,
          'bbox': [3805217.6677, 5547027.7296, 3814523.5604, 5565505.0634]
        }
      }
    ];

    const result = Util.prepareFeatureForMultipleEdit(features);

    console.log('-----', result);

    expect(result.mode).toEqual(EditFeatureMode.multipleEdit);
    expect(result.feature).toBeTruthy();
    expect(result.unsafeProperties).toBeTruthy();

    expect(result.unsafeProperties['not_exist_param']).toBeFalsy();
    expect(result.unsafeProperties['fz_mfstp']).toBeTruthy();
    expect(Object.keys(result.unsafeProperties).length === 12).toBeTruthy();

    expect(result.feature.properties['classid'] !== undefined).toBeTruthy();
    expect(result.feature.properties['fz_mfstp'] === undefined).toBeTruthy();

    // Check features ID
    expect(Object.keys(result.featuresId).length === 3).toBeTruthy();
    expect(result.featuresId['2']).toBeTruthy();
    expect(result.featuresId['4']).toBeTruthy();
    expect(result.featuresId['8']).toBeTruthy();
  });

});
