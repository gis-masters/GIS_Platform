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
import { forTestInteraction } from './testSchemas/forTestInteraction';
import { forTestParcelsNew } from './testSchemas/forTestParcelsNew';
import { forTestParcelsOld1 } from './testSchemas/forTestParcelsOld1';
import { forTestTitles } from './testSchemas/forTestTitles';
import { photoLayer } from './testSchemas/photoLayer';
import { propertyWithAllCheckedAttributes } from './testSchemas/propertyWithAllCheckedAttributes';
import { readonly } from './testSchemas/readonly';
import { simple } from './testSchemas/simple';
import { simpleMultiLine } from './testSchemas/simpleMultiline';
import { simpleMultiLineReadonly } from './testSchemas/simpleMultilineReadonly';
import { simpleMultiPoint } from './testSchemas/simpleMultipoint';
import { simpleMultiPointReadonly } from './testSchemas/simpleMultipointReadonly';
import { simplePoint } from './testSchemas/simplePoint';
import { simplePointDifferentStyle } from './testSchemas/simplePointDifferentStyle';
import { simpleReadonly } from './testSchemas/simpleReadonly';
import { simpleDocumentsWidthPattern } from './testSchemas/simpleWidthValidate';
import { testNotSorting } from './testSchemas/testNotSorting';
import { testShapeFeaturesCopy } from './testSchemas/testShapeFeaturesCopy';
import { testSorting } from './testSchemas/testSorting';
import { typesForAttrEllipsis } from './testSchemas/typesForAttrEllipsis';
import { withCalculatedArea } from './testSchemas/withCalculatedArea';
import { withDefinitionQuery } from './testSchemas/withDefinitionQuery';
import { withFias } from './testSchemas/withFias';
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
  forTestParcelsNew,
  forTestParcelsOld1,
  forTestInteraction,
  photoLayer,
  propertyWithAllCheckedAttributes,
  readonly,
  simple,
  simpleMultiLine,
  simpleMultiPoint,
  simplePoint,
  simplePointDifferentStyle,
  simpleReadonly,
  simpleDocumentsWidthPattern,
  simpleMultiLineReadonly,
  simpleMultiPointReadonly,
  typesForAttrEllipsis,
  testNotSorting,
  testShapeFeaturesCopy,
  testSorting,
  withCalculatedArea,
  withDefinitionQuery,
  withFile,
  withInappropriateStyleName,
  withoutViews,
  withSimpleContentType,
  withFias,
  withViews
];

export function getTestSchema(title: string): Schema {
  const schema = testSchemas.find(schema => schema.title === title);

  if (!schema) {
    throw new Error(`Запрошена неизвестная схема: '${title}'! Предварительно создайте схему в testSchemas.ts`);
  }

  return schema;
}
