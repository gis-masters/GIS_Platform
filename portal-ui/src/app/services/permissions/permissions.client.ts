import { boundClass } from 'autobind-decorator';

import { http } from '../api/http.service';
import { DataClient } from '../data/DataClient';
import { ResourcePermissions, RoleAssignmentBody } from './permissions.models';

@boundClass
class PermissionsClient extends DataClient {
  private static _instance: PermissionsClient;
  static get instance(): PermissionsClient {
    return this._instance || (this._instance = new this());
  }

  getDatasetRoleAssignmentsUrl(datasetIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/roleAssignment`;
  }

  private getDatasetRoleAssignmentUrl(id: number, datasetIdentifier: string): string {
    return `${this.getDatasetRoleAssignmentsUrl(datasetIdentifier)}/${id}`;
  }

  getTableRoleAssignmentsUrl(datasetIdentifier: string, tableIdentifier: string): string {
    return `${this.getVectorTableUrl(datasetIdentifier, tableIdentifier)}/roleAssignment`;
  }

  private getTableRoleAssignmentUrl(id: number, datasetIdentifier: string, tableIdentifier: string): string {
    return `${this.getTableRoleAssignmentsUrl(datasetIdentifier, tableIdentifier)}/${id}`;
  }

  getProjectPermissionsUrl(projectId: number): string {
    return this.getProjectUrl(projectId) + '/permissions';
  }

  private getProjectPermissionUrl(projectId: number, permissionId: number): string {
    return `${this.getProjectPermissionsUrl(projectId)}/${permissionId}`;
  }

  private getAllPermissionsUrl(): string {
    return this.getDataUrl() + '/all-permissions';
  }

  private getAllProjectsPermissionsUrl(): string {
    return `${this.getProjectsUrl()}/all-permissions`;
  }

  async getProjectPermissions(url: string): Promise<RoleAssignmentBody[]> {
    return http.get<RoleAssignmentBody[]>(url);
  }

  async getAllPermissions(url: string): Promise<RoleAssignmentBody[]> {
    return http.getPaged<RoleAssignmentBody>(url);
  }

  async getAllTablesAndDatasetsPermissions(): Promise<ResourcePermissions[]> {
    return await http.getPaged<ResourcePermissions>(this.getAllPermissionsUrl(), { params: { size: 100 } });
  }

  async addEntityPermission(payload: RoleAssignmentBody, url: string): Promise<void> {
    await http.post(url, payload);
  }

  async removeEntityPermission(id: number, url: string): Promise<void> {
    await http.delete(`${url}/${id}`);
  }

  async addTablePermission(
    payload: RoleAssignmentBody,
    datasetIdentifier: string,
    tableIdentifier: string
  ): Promise<void> {
    await http.post(this.getTableRoleAssignmentsUrl(datasetIdentifier, tableIdentifier), payload);
  }

  async removeTablePermission(
    payload: RoleAssignmentBody,
    datasetIdentifier: string,
    tableIdentifier: string
  ): Promise<void> {
    if (!payload.id) {
      throw new Error('Payload id is required');
    }
    await http.delete(this.getTableRoleAssignmentUrl(payload.id, datasetIdentifier, tableIdentifier));
  }

  async addDatasetPermission(payload: RoleAssignmentBody, datasetIdentifier: string): Promise<void> {
    await http.post(this.getDatasetRoleAssignmentsUrl(datasetIdentifier), payload);
  }

  async removeDatasetPermission(id: number, datasetIdentifier: string): Promise<void> {
    await http.delete(this.getDatasetRoleAssignmentUrl(id, datasetIdentifier));
  }

  async getAllProjectsPermissions(): Promise<{ [projectId: string]: RoleAssignmentBody[] }> {
    return await http.get<{ [projectId: string]: RoleAssignmentBody[] }>(this.getAllProjectsPermissionsUrl());
  }

  async addProjectPermission(payload: RoleAssignmentBody, projectId: number): Promise<void> {
    await http.post(this.getProjectPermissionsUrl(projectId), payload);
  }

  async removeProjectPermission(id: number, projectId: number): Promise<void> {
    await http.delete(this.getProjectPermissionUrl(projectId, id));
  }
}

export const permissionsClient = PermissionsClient.instance;
