import { http } from '../../http.service';
import { preparePageOptions } from '../../http.utils';
import { PageableResponse, PageOptions } from '../../models';
import {
  getProjectGroupsUrl,
  getProjectGroupUrl,
  getProjectLayersUrl,
  getProjectsUrl,
  getProjectUrl
} from '../../server-urls.service';

import { CrgLayer, CrgLayersGroup, CrgProject } from './projects.models';

export async function _reqGetProject(id: number): Promise<CrgProject> {
  return http.get<CrgProject>(await getProjectUrl(id));
}

export async function _reqGetProjects(pageOptions: PageOptions): Promise<PageableResponse<CrgProject>> {
  return http.get<PageableResponse<CrgProject>>(await getProjectsUrl(), {
    params: preparePageOptions(pageOptions)
  });
}

export async function _reqGetProjectsWithParticularOne(
  id: string | number,
  pageOptions: PageOptions
): Promise<[CrgProject[], number, number] | undefined> {
  return await http.getPageWithObject<CrgProject>(
    await getProjectsUrl(),
    preparePageOptions(pageOptions),
    (item: CrgProject) => item.id === Number(id),
    {},
    true
  );
}

export async function _reqGetAllProjects(): Promise<CrgProject[]> {
  return http.getPagedOld<CrgProject>(await getProjectsUrl(), { cache: { disabled: true } });
}

export async function _reqCreate(projectName: string): Promise<CrgProject> {
  return http.post<CrgProject>(await getProjectsUrl(), { projectName });
}

export async function _reqUpdateProject(id: number, patch: Partial<CrgProject>): Promise<void> {
  return http.patch(await getProjectUrl(id), patch);
}

export async function _reqDeleteProject(id: number): Promise<void> {
  return http.delete(await getProjectUrl(id));
}

export async function _reqGetProjectLayers(projectId: number): Promise<CrgLayer[]> {
  return http.get<CrgLayer[]>(await getProjectLayersUrl(projectId));
}

export async function _reqGetProjectGroups(projectId: number): Promise<CrgLayersGroup[]> {
  return http.get<CrgLayersGroup[]>(await getProjectGroupsUrl(projectId));
}

export async function _reqCreateGroup(group: CrgLayersGroup, projectId: number): Promise<CrgLayersGroup> {
  return http.post<CrgLayersGroup>(await getProjectGroupsUrl(projectId), group);
}

export async function _reqUpdateGroup(
  groupId: number,
  patch: Partial<CrgLayersGroup>,
  projectId: number
): Promise<void> {
  return http.patch(await getProjectGroupUrl(projectId, groupId), patch);
}

export async function _reqDeleteGroup(groupId: number, projectId: number): Promise<void> {
  return http.delete(await getProjectGroupUrl(projectId, groupId));
}
