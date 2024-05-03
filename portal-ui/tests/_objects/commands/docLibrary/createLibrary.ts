import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { requestAsAdmin } from '../requestAs';
import { getDocumentsLibraryByTitle } from './getDocLibraryByTitle';

export async function createLibrary(schema: Schema, title: string, versioned: boolean): Promise<void> {
  try {
    await getDocumentsLibraryByTitle(title);
  } catch {
    await requestAsAdmin(libraryClient.createLibrary, title, schema.name, versioned);
  }
}
