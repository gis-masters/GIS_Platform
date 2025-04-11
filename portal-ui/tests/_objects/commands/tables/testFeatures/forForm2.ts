import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forForm2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_816.2532, 5_000_018.9837],
            [6_656_833.8076, 5_000_016.669],
            [6_656_832.1301, 4_999_999.9639],
            [6_656_813.2806, 5_000_001.7513],
            [6_656_816.2532, 5_000_018.9837]
          ]
        ]
      ]
    },
    properties: {
      field_int: 314,
      field_double: 15.9,
      field_string: 'worldwide',
      field_date: '2023-03-02',
      field_document:
        '[{"id":26,"title":"sequi","libraryTableName":"dl_data_documents_with_simple_content_type_schema"}]',
      field_boolean: true,
      field_choice: 1111,
      field_url: '[{"url":"ya.ru","text":"someUrl"}]',
      field_fias__oktmo: '35656401',
      field_fias__address: 'Черноморское',
      field_fias__id: 5,
      field_file: ''
    }
  }
];
