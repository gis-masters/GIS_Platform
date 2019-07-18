import {XsdFeature} from './fgistp-rules.service';

describe('fgistp-rules service test', () => {

  it('should correct find feature by name', () => {
    const featuresNames: string[] = [
      'naturalriskzone', 'naturalriskzone_point', 'natureprotectarea', 'natureprotectarea_point',
      'technoriskarea_point', 'transportobj', 'transportobj_line', 'transportobj_point', 'technoriskarea',
      'waterpipeline_line', 'wastefacility_point', 'wastefacility', 'coastalprotectionzone', 'waterfacility_point',
      'waterfacility', 'publictransportstops_point', 'publictransportstops', 'admborder_line', 'otherobject_point',
      'otherobject', 'forest', 'streetv_line', 'telecomfacility_point', 'telecomfacility', 'education_point',
      'education', 'publictransportline_line', 'resortarea', 'emergencyprotectionobj_point', 'emergencyprotectionobj',
      'electrictransformer_point', 'electrictransformer', 'telecomnetworkline_line', 'railwayfacility_point',
      'railwayfacility', 'resortarea_point', 'prison_point', 'prison', 'greeneryplanting', 'social_point', 'social',
      'forestpark', 'agriculture_point', 'agriculture', 'waterways_line', 'wildlifeprotection_point',
      'wildlifeprotection', 'heritagearea', 'electricpowerstation_point', 'electricpowerstation',
      'publictransportservice_point', 'publictransportservice', 'historicsettlement', 'hazardarea',
      'transpsanitarygapzone', 'airtransportobj_point', 'airtransportobj', 'mineraldep', 'mineraldep_point',
      'envdanger_point', 'transplogisticobj_point', 'transplogisticobj', 'sanitaryprotectionzone',
      'hydraulicstructures_point', 'hydraulicstructures_line', 'drinkwaterprotectionzone', 'gaspipeline_line',
      'admerf', 'otherprotectionzone', 'road_line', 'street_line', 'autoservice', 'autoservice_point',
      'resortprotectionzone', 'heritage_point', 'thermalpipeline_line', 'gasfacility_point', 'gasfacility',
      'mineralarea', 'engsanitarygapzone', 'publictransportobj_point', 'publictransportobj', 'thermalfacility_point',
      'thermalfacility', 'envmonitoring_point', 'envmonitoring', 'protectionzone', 'resort_point',
      'resort', 'servicefacility_point', 'servicefacility', 'heritageprotectionzone', 'admenp', 'otherzone',
      'envdanger', 'engprotectionzone', 'foreshore', 'customcontrol_point', 'customcontrol', 'health_point',
      'health', 'hydro', 'hydro_line', 'hydro_point', 'transpprotectionzone', 'railwayline_line', 'pipeline_line',
      'floodarea', 'areabasedevelopment', 'fishprotectionzone', 'cemetery_point', 'cemetery', 'investmentzone',
      'natureprotectionzone', 'sewerpipeline_line', 'electricline_line', 'watertransportobj_point', 'watertransportobj',
      'waterprotectionzone', 'traditionalarea', 'public_point', 'public', 'sewerfacility_point', 'sewerfacility',
      'functionalzone', 'landuse', 'admesrf', 'culture_point', 'culture', 'specialeconomicarea',
      'engprotectionobj_line', 'engprotectionobj_point', 'manufacturing_point', 'manufacturing', 'admemo',
      'oilpipeline_line', 'authorityservice_point', 'authorityservice', 'sport_point', 'sport', 'recreation_point',
      'recreation', 'oilfacility_point', 'oilfacility'];

    const culture = getFeatureByName(featuresNames, 'culture');
    const agriculture = getFeatureByName(featuresNames, 'agriculture');
    const waterProtectionZone = getFeatureByName(featuresNames, 'waterprotectionzone');

    expect('culture').toEqual(culture);
    expect('agriculture').toEqual(agriculture);
    expect('waterprotectionzone').toEqual(waterProtectionZone);
  });

  function getFeatureByName(featuresNames: string[], name: string) {
    let fullCompareName;
    featuresNames.forEach(fName => {
      if (fName.toLowerCase() === name.toLowerCase()) {
        fullCompareName = name;
      }
    });

    if (fullCompareName) {
      return name;
    } else {
      return featuresNames.find(fName => fName.toLowerCase().includes(name.toLowerCase()));
    }
  }

});
