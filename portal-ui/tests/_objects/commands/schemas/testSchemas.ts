import { Schema } from '../../../../src/app/services/data/schema/schema.models';

import { editable } from './testSchemas/editable';
import { readonly } from './testSchemas/readonly';
import { allTypes } from './testSchemas/allTypes';
import { withViews } from './testSchemas/withViews';
import { testSorting } from './testSchemas/testSorting';
import { withoutViews } from './testSchemas/withoutViews';
import { forTestTitles } from './testSchemas/forTestTitles';
import { testNotSorting } from './testSchemas/testNotSorting';
import { allTypesEditable } from './testSchemas/allTypesEditable';
import { allTypesReadonly } from './testSchemas/allTypesReadonly';
import { withCalculatedArea } from './testSchemas/withCalculatedArea';
import { withDefinitionQuery } from './testSchemas/withDefinitionQuery';
import { allTypesWithAsTitle } from './testSchemas/allTypesWithAsTitle';
import { allTypesChoiceAsString } from './testSchemas/allTypesChoiceAsString';
import { withInappropriateStyleName } from './testSchemas/withInappropriateStyleName';

const testSchemas: Schema[] = [
  allTypes,
  allTypesChoiceAsString,
  allTypesEditable,
  allTypesReadonly,
  allTypesWithAsTitle,
  editable,
  forTestTitles,
  readonly,
  testNotSorting,
  testSorting,
  withCalculatedArea,
  withDefinitionQuery,
  withInappropriateStyleName,
  withoutViews,
  withViews
];

export function getTestSchema(title: string): Schema {
  const schema = testSchemas.find(schema => schema.title === title);

  if (!schema) {
    throw new Error(`Запрошена неизвестная схема: '${title}'! Предварительно создайте схему в testSchemas.ts`);
  }

  return schema;
}
