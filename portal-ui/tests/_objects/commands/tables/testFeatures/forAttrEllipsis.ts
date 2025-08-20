import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forAttrEllipsis: NewWfsFeature[] = [
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
      field_string:
        'тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст',
      field_document:
        '[{"id":26,"title":"тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст ","libraryTableName":"dl_data_documents_with_simple_content_type_schema"}]',
      field_choice: 1111,
      field_url:
        '[{"url":"ya.ru","text":"тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст тестовый текст "}]'
    }
  }
];
