import { clone } from 'lodash';

import { GeometryType, NewWfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { generateObjectBySchema } from '../../utils/generateObjectBySchema';

import { forForm } from './testFeatures/forForm';
import { forForm2 } from './testFeatures/forForm2';
import { forProkol } from './testFeatures/forProkol';
import { forTitles } from './testFeatures/forTitles';
import { forSorting } from './testFeatures/forSorting';
import { forFiltering } from './testFeatures/forFiltering';
import { forOtherFiltering } from './testFeatures/forOtherFiltering';
import { forOtherFiltering2 } from './testFeatures/forOtherFiltering2';
import { forSimpleFiltering } from './testFeatures/forSimpleFiltering';
import { forFeaturesSidebar } from './testFeatures/forFeaturesSidebar';
import { getTestUser } from '../auth/testUsers';
import { getUserByEmail } from '../auth/getUserByEmail';

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
  switch (key) {
    case 'для тестирования прокола':
    case 'данные для тестирования сортировки': {
      return forSorting;
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
    case 'тестирование прокола': {
      return forProkol;
    }
    case 'тестирование панели объектов': {
      return forFeaturesSidebar;
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
    case 'данные для тестирования сортировки с пагинацией': {
      return generateByTemplate('тестовые данные 27', schema);
    }
    case 'данные в количестве 628 для тестирования фильтрации': {
      return generateByTemplate('тестовые данные 628', schema);
    }
    default: {
      if (key.includes(KEY)) {
        return generateByTemplate(key, schema);
      }

      throw new Error('Указан не существующий ключ для шаблонных фичей');
    }
  }
}
