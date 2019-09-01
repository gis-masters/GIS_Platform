ALTER TABLE public.custom_rules
    ADD COLUMN IF NOT EXISTS calculated_fields text;

UPDATE public.custom_rules SET calculated_fields='var results = {}; var k = 3; ' ||
                                                 'if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;';

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('naturalriskzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('street_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                         'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('streetv_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                          'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('road_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('pipeline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                           'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('public_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                          'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('recreation_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('sport_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                         'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('authorityservice_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                    'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('railwayfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('emergencyprotectionobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('sewerfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('watertransportobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('cemetery_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('health_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('telecomfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('thermalfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('publictransportobj', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('publictransportobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('autoservice_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('mineraldep_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('airtransportobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('education_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('naturalriskzone_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('natureprotectarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                               'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('natureprotectarea_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                     'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('technoriskarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                            'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('technoriskarea_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('prison_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                          'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('social_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                          'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('wastefacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('waterfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('coastalprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('otherobject', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('otherobject_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransport_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('resortarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                        'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('resortarea_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('forestpark', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                      'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('culture_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                           'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('agriculture', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                      'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('agriculture_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('waterways', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('wildlifeprotection', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                     'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('wildlifeprotection_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                    'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('heritagearea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('heritage_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('electricpowerstation', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                        'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('electricpowerstation_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                        'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransportservice', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransportservice_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                        'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransportstops_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                      'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('historicsettlement', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hazardarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('transpsanitarygapzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('transplogisticobj', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('transplogisticobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                     'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('sanitaryprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hydraulicstructures_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hydraulicstructures_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('drinkwaterprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('gaspipeline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admerf', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('resortprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('thermalpipeline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('gasfacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                         'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('gasfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                               'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('mineralarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('engsanitarygapzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('transportobj_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                               'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('transportobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('envmonitoring', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                           'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('envmonitoring_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('resort', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('resort_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                          'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('servicefacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                           'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('servicefacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('heritageprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admenp', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('envdanger', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('envdanger_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('otherprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('protectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admborder_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('engprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('foreshore', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('customcontrol', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('customcontrol_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hydro', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hydro_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hydro_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('transpprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('railwayline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('areabasedevelopment', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('fishprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('investmentzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('natureprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('sewerpipeline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('electricline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('waterprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('traditionalarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('landuse', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admesrf', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('specialeconomicarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('electrictransformer', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('electrictransformer_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('telecomnetworkline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('engprotectionobj_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                   'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('engprotectionobj_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                    'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('manufacturing', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                           'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('manufacturing_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admemo', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('oilpipeline_line', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('oilfacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                         'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('oilfacility_point', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                               'results.ruleid = '''' + obj.classid + k + obj.status; return results;');
