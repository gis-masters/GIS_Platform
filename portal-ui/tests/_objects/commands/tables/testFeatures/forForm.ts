import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forForm: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_657_047.4063, 4_999_784.2722],
            [6_657_013.8497, 4_999_783.7166],
            [6_657_013.8603, 4_999_727.9532],
            [6_657_023.1343, 4_999_728.182],
            [6_657_022.8372, 4_999_751.2962],
            [6_657_041.3919, 4_999_751.4818],
            [6_657_041.1438, 4_999_761.5403],
            [6_657_023.148, 4_999_760.8245],
            [6_657_023.9173, 4_999_773.9003],
            [6_657_047.1022, 4_999_774.4721],
            [6_657_047.4063, 4_999_784.2722]
          ]
        ]
      ]
    },
    properties: {
      field_int: 314,
      field_double: 15.9,
      field_string: 'worldwide',
      field_date: '2023-03-02',
      field_document: '[{"id":26,"title":"sequi","libraryTableName":"dl_data_documents_with_simple_content_type"}]',
      field_boolean: true,
      field_choice: 1111,
      field_url: '[{"url":"ya.ru","text":"someUrl"}]',
      field_fias__oktmo: '35656401',
      field_fias__address: 'Черноморское',
      field_fias__id: 5,
      field_file: [
        {
          id: '5f6d0a28-3871-4a13-8fba-b411b54dc4f0',
          title: 'some super file',
          size: 314
        }
      ]
    }
  }
];
