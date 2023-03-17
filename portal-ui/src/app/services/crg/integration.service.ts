import { _reqSendToSed } from './integration.client';

export async function sendToSed(libraryTableName: string, recordId: number): Promise<void> {
  await _reqSendToSed(libraryTableName, recordId);
}
