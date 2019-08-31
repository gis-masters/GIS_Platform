ALTER TABLE public.custom_rules
    ADD COLUMN IF NOT EXISTS calculated_fields text;

UPDATE public.custom_rules SET calculated_fields='var results = {}; var k = 3; ' ||
                                                 'if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                                 'results.ruleid = '''' + obj.classid + k + obj.status; return results;';

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('naturalriskzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('natureprotectarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('technoriskarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('wastefacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
  VALUES ('coastalprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                             'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('otherobject', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransportline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('resortarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                               'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('forestpark', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                      'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('agriculture', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                      'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('waterways', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                       'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('wildlifeprotection', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                     'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('heritagearea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                              'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('electricpowerstation', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                        'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransportservice', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
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
VALUES ('sanitaryprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('hydraulicstructures', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('drinkwaterprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('gaspipeline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admerf', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('resortprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('thermalpipeline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('gasfacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('mineralarea', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('engsanitarygapzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('publictransportobj', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('envmonitoring', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('resort', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('servicefacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
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
VALUES ('otherprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('protectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admborder', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
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
VALUES ('hydro', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('transpprotectionzone', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('railwayline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
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
VALUES ('sewerpipeline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('electricline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
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
VALUES ('telecomnetworkline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('engprotectionobj', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('manufacturing', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('admemo', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('oilpipeline', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');

INSERT INTO public.custom_rules(class_name, calculated_fields)
VALUES ('oilfacility', 'var results = {}; var k = 3; if(obj.reg_status < k) {k = obj.reg_status} ' ||
                                  'results.ruleid = '''' + obj.classid + k + obj.status; return results;');
