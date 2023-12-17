import { kpt } from './kpt.client';
import { KptRequestInfo, KptTaskInfo } from './kpt.models';

export async function importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
  return await kpt.importKpt(importRequest);
}

export async function requestKpt(): Promise<KptRequestInfo> {
  return await kpt.getLibraryRecord();
}
