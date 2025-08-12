import { clone } from 'lodash';

import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { GeometryType, NewWfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { generateObjectBySchema } from '../../utils/generateObjectBySchema';
import { getUserByEmail } from '../auth/getUserByEmail';
import { getTestUser } from '../auth/testUsers';
import { blackSea } from './testFeatures/blackSea';
import { crimea } from './testFeatures/crimea';
import { smallTriangle } from './testFeatures/featuresForTests';
import { forAttrEllipsis } from './testFeatures/forAttrEllipsis';
import { forCopy } from './testFeatures/forCopy';
import { forFeaturesSidebar } from './testFeatures/forFeaturesSidebar';
import { forFiltering } from './testFeatures/forFiltering';
import { forForm } from './testFeatures/forForm';
import { forForm2 } from './testFeatures/forForm2';
import { forLegendTest1 } from './testFeatures/forLegendTest1';
import { forLegendTest2 } from './testFeatures/forLegendTest2';
import { forLegendTest3 } from './testFeatures/forLegendTest3';
import { forOtherFiltering } from './testFeatures/forOtherFiltering';
import { forOtherFiltering2 } from './testFeatures/forOtherFiltering2';
import { forPhotoLayerWithMultipleObjects } from './testFeatures/forPhotoLayerWithMultipleObjects';
import { forProkol } from './testFeatures/forProkol';
import { forSimpleFiltering } from './testFeatures/forSimpleFiltering';
import { forSorting } from './testFeatures/forSorting';
import { forTitles } from './testFeatures/forTitles';
import { line } from './testFeatures/line';
import { line2 } from './testFeatures/line2';
import { multiLine } from './testFeatures/multiline';
import { multiLine2 } from './testFeatures/multiline2';
import { multiPoint } from './testFeatures/multipoint';
import { multiPoint2 } from './testFeatures/multipoint2';
import { multiPolygon } from './testFeatures/multiPolygon';
import { multiPolygon2 } from './testFeatures/multiPolygon2';
import { point } from './testFeatures/point';
import { singleFeature } from './testFeatures/singleFeature';
import { theLetterC } from './testFeatures/theLetterC';
import { ursaMajor } from './testFeatures/ursaMajor';

const KEY = 'тестовые данные';

const baseFeature: NewWfsFeature = {
  type: 'Feature',
  geometry: {
    type: GeometryType.MULTI_POLYGON,
    coordinates: [
      [
        [
          [6_657_058.3102, 4_999_784.8132],
          [6_657_069.4935, 4_999_785.0891],
          [6_657_066.2984, 4_999_726.5265],
          [6_657_059.1796, 4_999_727.4389],
          [6_657_058.3102, 4_999_784.8132]
        ]
      ]
    ]
  },
  properties: {}
};

function generateRandomFeatures(schema: Schema, count: number): NewWfsFeature[] {
  const features: NewWfsFeature[] = [];

  for (let i = 0; i < count; i++) {
    const newFeature = clone(baseFeature);
    newFeature.properties = generateObjectBySchema(schema);

    features.push(newFeature);
  }

  return features;
}

function generateByTemplate(template: string, schema: Schema | undefined): NewWfsFeature[] {
  if (!schema) {
    throw new Error('Для шаблонного сценария схема обязательна');
  }

  if (!template.includes(KEY)) {
    throw new Error(`Не корректный шаблон! Ожидается строка: '${KEY} 20'`);
  }

  const features: NewWfsFeature[] = [];
  const amount = Number(template.split(KEY)[1]);
  generateRandomFeatures(schema, amount).forEach(feature => {
    features.push(feature);
  });

  return features;
}

async function setUserFieldsData(feature: NewWfsFeature[]): Promise<NewWfsFeature[]> {
  const user1 = await getUserByEmail(getTestUser('Администратор организации').email);
  const user2 = await getUserByEmail(getTestUser('Джинни').email);

  feature[0].properties.field_user_id = user1.id;
  feature[0].properties.field_user = `[{"id":${user1.id},"email":"hermione@admin1","name":"Hermione","surname":"Granger","middleName":""},{"id":${user2.id},"email":"ginny@user1","name":"Ginny","surname":"Weasley","middleName":"Molly"}]`;

  return feature;
}

export async function getTestFeatures(key: string, schema?: Schema): Promise<NewWfsFeature[]> {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (key) {
    case 'для тестирования прокола':
    case 'данные для тестирования сортировки': {
      return forSorting;
    }
    case 'объект как буква С': {
      return theLetterC;
    }
    case 'тестирование фильтрации': {
      return forFiltering;
    }
    case 'тестирование формы объекта': {
      return setUserFieldsData(forForm);
    }
    case 'тестирование формы объекта 2': {
      return setUserFieldsData(forForm2);
    }
    case 'тестирование обрезания текста в аттрабутивке': {
      return forAttrEllipsis;
    }
    case 'тестирование прокола': {
      return forProkol;
    }
    case 'небольшой треугольник': {
      return smallTriangle;
    }
    case 'мультиполигон': {
      return multiPolygon;
    }
    case 'мультиполигон c 2 полигонами': {
      return multiPolygon2;
    }
    case 'линия': {
      return line;
    }
    case 'линия которая выглядит как линия': {
      return line2;
    }
    case 'мультилиния': {
      return multiLine;
    }
    case 'мультилиния 2 линиями': {
      return multiLine2;
    }
    case 'несколько точек': {
      return ursaMajor;
    }
    case 'точка': {
      return point;
    }
    case 'мультиточка': {
      return multiPoint;
    }
    case 'мультиточка с 2 точками': {
      return multiPoint2;
    }
    case 'тестирование панели объектов': {
      return forFeaturesSidebar;
    }
    case 'для тестирования легенды 1': {
      return forLegendTest1;
    }
    case 'для тестирования легенды 2': {
      return forLegendTest2;
    }
    case 'для тестирования легенды 3': {
      return forLegendTest3;
    }
    case 'один объект': {
      return singleFeature;
    }
    case 'тестирование заголовков': {
      return forTitles;
    }
    case 'для тестирования фильтрации': {
      return forOtherFiltering;
    }
    case 'для тестирования фильтрации 2': {
      return forOtherFiltering2;
    }
    case 'для простой фильтрации': {
      return forSimpleFiltering;
    }
    case 'для фотослоя с несколькими объектами': {
      return forPhotoLayerWithMultipleObjects;
    }
    case 'данные для тестирования сортировки с пагинацией': {
      return generateByTemplate('тестовые данные 27', schema);
    }
    case 'данные в количестве 628 для тестирования фильтрации': {
      return generateByTemplate('тестовые данные 628', schema);
    }
    case 'для копирования (в том числе без геометрии)': {
      return forCopy;
    }
    case 'Чёрное море': {
      return blackSea;
    }
    case 'Крым': {
      return crimea;
    }
    default: {
      if (key.includes(KEY)) {
        return generateByTemplate(key, schema);
      }

      throw new Error('Указан не существующий ключ для шаблонных фичей');
    }
  }
}
