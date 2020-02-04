import { observable, computed, action } from 'mobx';
import {FeatureDescription} from '../services/crg/data-schema.service';
import {GeometryType} from '../services/util/stringUtil';

export interface CrgLayer {
  id: string;
  title: string;
  internalName: string;
  enabled: boolean;
  position: number;
  transparency: number;
  zoom: number;
  maxZoom: number;
  minZoom: number;
  geometryType: string;
  schemaId: string;

  complexName?: string;
  href?: string;
  geometry?: GeometryType | undefined;
  schema?: FeatureDescription;
}

export interface Project {
  id: string;
  name: string;
  internalName: string;
  bbox: string;
  order: number;
  organizationId: number;
  layers: CrgLayer[];
  createdAt: string;
}

class ProjectsList {

  private static _instance: ProjectsList;
  @observable private _list?: Project[];
  @observable private deleted: string[] = [];

  private constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  @action
  setList(list: Project[]) {
    this._list = list;
  }

  @action
  considerDeleted(id: string) {
    this.deleted.push(id);
  }

  @computed
  get list(): Project[] {
    return (this._list || [])
      .filter(p => !this.deleted.includes(p.id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  @computed
  get isLoaded(): boolean {
    return Boolean(this._list);
  }

}

export const projectsList = ProjectsList.instance;
