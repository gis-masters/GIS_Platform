import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { allTypes } from './testSchemas/allTypes';
import { allTypesChoiceAsString } from './testSchemas/allTypesChoiceAsString';
import { allTypesEditable } from './testSchemas/allTypesEditable';
import { allTypesReadonly } from './testSchemas/allTypesReadonly';
import { createDocumentsSource } from './testSchemas/createDocumentsSource';
import { createDocumentsTarget } from './testSchemas/createDocumentsTarget';
import { dlDataWithSimpleContentType } from './testSchemas/dlDataWithSimpleContentType';
import { documentWithDocumentField } from './testSchemas/documentWithDocumentField';
import { documentWithoutVersioned } from './testSchemas/documentWithoutVersioned';
import { editable } from './testSchemas/editable';
import { forTestTitles } from './testSchemas/forTestTitles';
import { photoLayer } from './testSchemas/photoLayer';
import { propertyWithAllCheckedAttributes } from './testSchemas/propertyWithAllCheckedAttributes';
import { readonly } from './testSchemas/readonly';
import { simple } from './testSchemas/simple';
import { testNotSorting } from './testSchemas/testNotSorting';
import { testShapeFeaturesCopy } from './testSchemas/testShapeFeaturesCopy';
import { testSorting } from './testSchemas/testSorting';
import { withCalculatedArea } from './testSchemas/withCalculatedArea';
import { withDefinitionQuery } from './testSchemas/withDefinitionQuery';
import { withFile } from './testSchemas/withFiles';
import { withInappropriateStyleName } from './testSchemas/withInappropriateStyleName';
import { withoutViews } from './testSchemas/withoutViews';
import { withSimpleContentType } from './testSchemas/withSimpleContentType';
import { withViews } from './testSchemas/withViews';

const testSchemas: Schema[] = [
  allTypes,
  allTypesChoiceAsString,
  allTypesEditable,
  allTypesReadonly,
  createDocumentsSource,
  createDocumentsTarget,
  dlDataWithSimpleContentType,
  documentWithDocumentField,
  documentWithoutVersioned,
  editable,
  forTestTitles,
  photoLayer,
  propertyWithAllCheckedAttributes,
  readonly,
  simple,
  testNotSorting,
  testShapeFeaturesCopy,
  testSorting,
  withCalculatedArea,
  withDefinitionQuery,
  withFile,
  withInappropriateStyleName,
  withoutViews,
  withSimpleContentType,
  withViews
];

export function getTestSchema(title: string): Schema {
  const schema = testSchemas.find(schema => schema.title === title);

  if (!schema) {
    throw new Error(`Запрошена неизвестная схема: '${title}'! Предварительно создайте схему в testSchemas.ts`);
  }

  return schema;
}
