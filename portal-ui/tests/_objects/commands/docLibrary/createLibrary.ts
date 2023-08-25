import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { getDocumentsLibraryByTitle } from './getDocLibraryByTitle';
import { requestAsAdmin } from '../requestAs';

export async function createLibrary(schema: Schema, title: string, versioned: boolean): Promise<void> {
  try {
    await getDocumentsLibraryByTitle(title);
  } catch {
    await requestAsAdmin(docLibraryClient.createLibrary, title, schema.name, versioned);
  }
}
