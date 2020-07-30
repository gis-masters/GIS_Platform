import { action, computed, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';

import { CrgLayersGroup, CrgLayer, CrgLayerType, Project, TreeItem } from '../services/crg/projects.models';
import { CrgProjectBaseMap } from '../services/crg/base-maps.models';

const MAX_LAYERS_IN_BATCH = 100;

class CurrentProject {
  private static _instance: CurrentProject;

  @observable bbox: string;
  @observable createdAt: string;
  @observable groups: CrgLayersGroup[];
  @observable id: number;
  @observable internalName: string;
  @observable name: string;
  @observable order: number;
  @observable organizationId: number;
  @observable baseMaps: CrgProjectBaseMap[];
  @observable default: boolean;
  @observable layers: CrgLayer[];

  private constructor() {}

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @computed
  get tree(): TreeItem[] {
    return [
      ...this.groups.map(group => ({
        id: group.id,
        payload: group,
        isGroup: true
      })),
      ...this.vectorLayers.map(layer => ({
        id: layer.id,
        payload: layer,
        isGroup: false
      })),
      ...this.rasterLayers.map(layer => ({
        id: layer.id,
        payload: layer,
        isGroup: false
      })),
      ...this.externalLayers.map(layer => ({
        id: layer.id,
        payload: layer,
        isGroup: false
      }))
    ]
      .map((item: TreeItem, i, items) => {
        const parentId = item.isGroup ? (item.payload as CrgLayersGroup).parent : (item.payload as CrgLayer).groupId;

        if (parentId) {
          item.parent = items.find(t => t.isGroup && t.id === parentId) as TreeItem<CrgLayersGroup>;
        }

        return item;
      })
      .map(item => {
        item.depth = this.getDept(item);
        item.visible = this.getGenusVisibility(item);

        if (!item.isGroup) {
          item.actualTransparency = this.getActualTransparency(item);
        }

        return item;
      })
      .sort(this.sorter);
  }

  @computed
  get visibleLayers(): TreeItem<CrgLayer>[] {
    return this.tree.filter(item => item.visible && !item.isGroup) as TreeItem<CrgLayer>[];
  }

  @computed
  get visibleLayersBatched(): TreeItem<CrgLayer>[][] {
    return this.visibleLayers.reduce((acc: TreeItem<CrgLayer>[][], item: TreeItem<CrgLayer>) => {
      if (!acc.length) {
        return [[item]];
      }

      const lastBatch = acc[acc.length - 1];
      const lastItem = lastBatch[lastBatch.length - 1];
      const lastTransparency = lastItem.actualTransparency;
      const lastType = lastItem.payload.type;
      const transparency = item.actualTransparency;
      const typ = item.payload.type;

      if (transparency === lastTransparency && typ === lastType && lastBatch.length < MAX_LAYERS_IN_BATCH) {
        lastBatch.push(item);
      } else {
        acc.push([item]);
      }

      return acc;
    }, []);
  }

  @computed
  get visibleLayersWithoutRasters(): TreeItem<CrgLayer>[] {
    return this.visibleLayers.filter(item => item.payload.type !== CrgLayerType.RASTER);
  }

  @action
  setProject(project: Project | null) {
    this.bbox = project && project.bbox;
    this.createdAt = project && project.createdAt;
    this.id = project && project.id;
    this.internalName = project && project.internalName;
    this.groups = project ? project.groups : [];
    this.name = project && project.name;
    this.order = project && project.order;
    this.organizationId = project && project.organizationId;
    this.baseMaps = project && project.baseMaps;
    this.layers = project ? project.layers : [];
  }

  @computed
  get vectorLayers() {
    return this.layers.filter(l => l.type === CrgLayerType.VECTOR);
  }

  @computed
  get rasterLayers() {
    return this.layers.filter(l => l.type === CrgLayerType.RASTER);
  }

  @computed
  get externalLayers() {
    return this.layers.filter(l => l.type === CrgLayerType.EXTERNAL);
  }

  @action
  deleteLayer(layer: CrgLayer) {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  @action
  patch<T>(item: T, patch: Partial<T>) {
    Object.assign(item, patch);
  }

  private getDept(item: TreeItem): number {
    return item.parent ? this.getDept(item.parent) + 1 : 0;
  }

  private getGenusVisibility(item: TreeItem): boolean {
    return item.payload.enabled && (item.parent ? this.getGenusVisibility(item.parent) : true);
  }

  @boundMethod
  private sorter(a: TreeItem, b: TreeItem): number {
    if (a.parent === b.parent) {
      return this.sortSiblings(a, b);
    }

    return this.sortCommonAncestorsChildren(a, b);
  }

  private sortSiblings(a: TreeItem, b: TreeItem): number {
    const { payload: payloadA, isGroup: aGroup } = a;
    const { payload: payloadB, isGroup: bGroup } = b;

    return payloadA.position - payloadB.position || payloadA.id - payloadB.id || Number(bGroup) - Number(aGroup);
  }

  private sortCommonAncestorsChildren(a: TreeItem, b: TreeItem, depth?: number): number {
    if (depth === undefined) {
      depth = Math.min(a.depth, b.depth);
    }

    const ax = this.getGenusAtDept(a, depth);
    const bx = this.getGenusAtDept(b, depth);

    if (ax === bx) {
      return a.depth - b.depth;
    }

    if (ax.parent === bx.parent) {
      return this.sortSiblings(ax, bx);
    }

    return this.sortCommonAncestorsChildren(ax, bx, depth - 1);
  }

  private getGenusAtDept(item: TreeItem, depth: number): TreeItem {
    if (item.depth === depth) {
      return item;
    } else {
      return this.getGenusAtDept(item.parent, depth);
    }
  }

  private getActualTransparency(item: TreeItem, value?: number): number {
    value = value || item.payload.transparency;

    if (item.parent) {
      return this.getActualTransparency(item.parent, Math.round(value * (item.parent.payload.transparency / 100)));
    }

    return value;
  }
}

export const currentProject = CurrentProject.instance;
