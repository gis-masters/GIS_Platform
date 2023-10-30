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
import { createDocumentsSource } from './testSchemas/createDocumentsSource';
import { createDocumentsTarget } from './testSchemas/createDocumentsTarget';
import { withSimpleContentType } from './testSchemas/withSimpleContentType';
import { testShapeFeaturesCopy } from './testSchemas/testShapeFeaturesCopy';
import { allTypesChoiceAsString } from './testSchemas/allTypesChoiceAsString';
import { documentWithoutVersioned } from './testSchemas/documentWithoutVersioned';
import { documentWithDocumentField } from './testSchemas/documentWithDocumentField';
import { withInappropriateStyleName } from './testSchemas/withInappropriateStyleName';
import { dlDataWithSimpleContentType } from './testSchemas/dlDataWithSimpleContentType';
import { withFile } from './testSchemas/withFiles';

const testSchemas: Schema[] = [
  allTypes,
  allTypesChoiceAsString,
  allTypesEditable,
  allTypesReadonly,
  editable,
  forTestTitles,
  readonly,
  testNotSorting,
  testSorting,
  withSimpleContentType,
  documentWithoutVersioned,
  withCalculatedArea,
  withDefinitionQuery,
  documentWithDocumentField,
  withInappropriateStyleName,
  dlDataWithSimpleContentType,
  testShapeFeaturesCopy,
  withoutViews,
  withFile,
  withViews,
  createDocumentsSource,
  createDocumentsTarget
];

export function getTestSchema(title: string): Schema {
  const schema = testSchemas.find(schema => schema.title === title);

  if (!schema) {
    throw new Error(`Запрошена неизвестная схема: '${title}'! Предварительно создайте схему в testSchemas.ts`);
  }

  return schema;
}
