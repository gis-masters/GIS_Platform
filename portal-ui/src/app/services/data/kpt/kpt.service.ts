import { kpt } from './kpt.client';
import { KptTaskInfo } from './kpt.models';

export async function importKpt(importRequest: Record<string, unknown>): Promise<KptTaskInfo> {
  return await kpt.importKpt(importRequest);
}
