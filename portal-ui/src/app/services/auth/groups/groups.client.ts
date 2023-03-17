import { getGroupsUrl, getGroupUrl, getGroupUserUrl } from '../../server-urls.service';
import { http } from '../../http.service';

import { CrgGroup, GroupData } from './groups.models';

export async function _reqGetAllGroups(): Promise<CrgGroup[]> {
  return http.getPaged<CrgGroup>(await getGroupsUrl());
}

export async function _reqCreateGroup(groupData: GroupData): Promise<CrgGroup> {
  return http.post<CrgGroup>(await getGroupsUrl(), groupData);
}

export async function _reqUpdateGroup(group: CrgGroup): Promise<CrgGroup> {
  return http.patch<CrgGroup>(await getGroupUrl(group.id), group);
}

export async function _reqDeleteGroup(groupId: number): Promise<void> {
  return http.delete(await getGroupUrl(groupId));
}

export async function _reqAddUserToGroup(userId: number, groupId: number): Promise<void> {
  return http.post(await getGroupUserUrl(groupId, userId), {});
}

export async function _reqRemoveUserFromGroup(userId: number, groupId: number): Promise<void> {
  return http.delete(await getGroupUserUrl(groupId, userId));
}
