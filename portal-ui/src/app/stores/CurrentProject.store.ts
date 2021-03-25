import { action, computed, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { ProjectBasemap } from '../services/crg/basemaps.models';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgProject,
  NewCrgLayer,
  NewCrgLayersGroup,
  TreeItem
} from '../services/crg/projects.models';
import { getPatch } from '../services/util/patch';

const MAX_LAYERS_IN_BATCH_DEFAULT = 5;

interface CrgProjectData extends CrgProject {
  layers: (CrgLayer | NewCrgLayer)[];
  groups: (CrgLayersGroup | NewCrgLayersGroup)[];
  layersErrors: { [key: string]: string[] };
}

const emptyProject: CrgProjectData = {
  id: 0,
  baseMaps: [],
  bbox: '',
  createdAt: '',
  default: false,
  name: '',
  order: 0,
  organizationId: 0,
  internalName: '',
  layersCount: 0,
  layers: [],
  layersErrors: {},
  groups: []
};

class CurrentProject implements CrgProjectData {
  private static _instance: CurrentProject;

  @observable bbox: string;
  @observable createdAt: string;
  @observable id: number;
  @observable internalName: string;
  @observable name: string;
  @observable order: number;
  @observable organizationId: number;
  @observable baseMaps: ProjectBasemap[];
  @observable default: boolean;
  @observable layers: (CrgLayer | NewCrgLayer)[];
  @observable groups: (CrgLayersGroup | NewCrgLayersGroup)[];
  @observable primalLayers: CrgLayer[];
  @observable primalGroups: (CrgLayersGroup | NewCrgLayersGroup)[];
  @observable layersCount: number;
  @observable _maxLayersInBatch?: number;
  @observable layersErrors: { [key: string]: string[] };

  @observable viewZoom: number;

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
        isGroup: false,
        errors: this.layersErrors[layer.complexName]
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
        const parentId = item.isGroup ? (item.payload as CrgLayersGroup).parentId : (item.payload as CrgLayer).parentId;

        if (parentId) {
          item.parent = items.find(t => t.isGroup && t.id === parentId) as TreeItem<CrgLayersGroup>;
        }

        return item;
      })
      .map((item, i, tree) => {
        item.depth = this.getDept(item);
        item.visible = !(item.errors && item.errors.length) && this.getGenusVisibility(item);
        item.hiddenByZoom = this.isHiddenByZoom(item);

        if (!item.isGroup) {
          item.actualTransparency = this.getActualTransparency(item);
        } else {
          item.isEmptyGroup = !tree.some(someItem => !someItem.isGroup && this.isAncestor(someItem, item));
        }

        return item;
      })
      .sort(this.sorter);
  }

  @computed
  get visibleTreeWithEmptyGroups(): TreeItem[] {
    return this.tree.filter(item => !this.hasCollapsedParent(item));
  }

  @computed
  get visibleTree(): TreeItem[] {
    return this.visibleTreeWithEmptyGroups.filter(({ isEmptyGroup }) => !isEmptyGroup);
  }

  @computed
  get visibleOnMapLayers(): TreeItem<CrgLayer>[] {
    return this.tree.filter(item => !item.isGroup && item.visible && !item.hiddenByZoom) as TreeItem<CrgLayer>[];
  }

  @computed
  get visibleLayersBatched(): TreeItem<CrgLayer>[][] {
    return this.visibleOnMapLayers.reduce((acc: TreeItem<CrgLayer>[][], item: TreeItem<CrgLayer>) => {
      if (!acc.length) {
        return [[item]];
      }

      const lastBatch = acc[acc.length - 1];
      const lastItem = lastBatch[lastBatch.length - 1];
      const lastTransparency = lastItem.actualTransparency;
      const lastType = lastItem.payload.type;
      const transparency = item.actualTransparency;
      const typ = item.payload.type;

      if (transparency === lastTransparency && typ === lastType && lastBatch.length < this.maxLayersInBatch) {
        lastBatch.push(item);
      } else {
        acc.push([item]);
      }

      return acc;
    }, []);
  }

  @computed
  get visibleLayersWithoutRasters(): TreeItem<CrgLayer>[] {
    return this.visibleOnMapLayers.filter(item => item.payload.type !== CrgLayerType.RASTER);
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

  @computed
  private get maxLayersInBatch() {
    return Number(this._maxLayersInBatch || MAX_LAYERS_IN_BATCH_DEFAULT);
  }

  @computed
  get queriesQueueLength(): number {
    return Object.values(this.queriesQueue).flat().length;
  }

  @computed
  get queriesQueue(): {
    groupsToCreate: NewCrgLayersGroup[];
    groupsToPatch: [number, Partial<CrgLayersGroup>][];
    layersToCreate: NewCrgLayer[];
    layersToPatch: [number, Partial<CrgLayer>][];
    layersToDelete: number[];
    groupsToDelete: number[];
  } {
    const groupsMeaningfulFields: (keyof CrgLayersGroup)[] = [
      'enabled',
      'expanded',
      'parentId',
      'position',
      'title',
      'transparency'
    ];

    const layersMeaningfulFields: (keyof NewCrgLayer)[] = ['enabled', 'parentId', 'position', 'title', 'transparency'];

    return {
      groupsToCreate: this.tree
        .filter(({ isGroup, payload }) => isGroup && this.primalGroups.every(({ id }) => id !== payload.id))
        .map(({ payload }) => payload as NewCrgLayersGroup),

      groupsToPatch: this.groups
        .map(group => [group, this.primalGroups.find(primalGroup => primalGroup.id === group.id)])
        .filter(([, primalGroup]) => primalGroup)
        .map(
          ([group, primalGroup]) =>
            [group.id, getPatch(group, primalGroup, groupsMeaningfulFields)] as [number, Partial<CrgLayersGroup>]
        )
        .filter(([, patch]) => Object.keys(patch).length),

      layersToCreate: this.tree
        .filter(({ isGroup, payload }) => !isGroup && this.primalLayers.every(({ id }) => id !== payload.id))
        .map(({ payload }) => payload as NewCrgLayer),

      layersToPatch: this.layers
        .map(layer => [layer, this.primalLayers.find(primalLayer => primalLayer.id === layer.id)])
        .filter(([, primalLayer]) => primalLayer)
        .map(
          ([layer, primalLayer]) =>
            [layer.id, getPatch(layer, primalLayer, layersMeaningfulFields)] as [number, Partial<CrgLayer>]
        )
        .filter(([, patch]) => Object.keys(patch).length),

      layersToDelete: this.primalLayers
        .filter(primalLayer => !this.layers.some(layer => primalLayer.id === layer.id))
        .map(({ id }) => id),

      groupsToDelete: this.primalGroups
        .filter(primalGroup => !this.groups.some(group => primalGroup.id === group.id))
        .sort(
          (a, b) =>
            this.tree.findIndex(({ isGroup, id }) => isGroup && id === b.id) -
            this.tree.findIndex(({ isGroup, id }) => isGroup && id === a.id)
        )
        .map(({ id }) => id)
    };
  }

  @action
  setProject(project: CrgProject, layers: CrgLayer[], groups: CrgLayersGroup[]) {
    Object.assign(this, emptyProject, {
      ...project,
      layers,
      groups,
      primalLayers: cloneDeep(layers),
      primalGroups: cloneDeep(groups)
    });
  }

  @action
  dropProject() {
    Object.assign(this, emptyProject);
  }

  @action
  deleteLayer(layer: CrgLayer) {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  @action
  deleteGroup(deletingGroup: CrgLayersGroup) {
    const index = this.groups.indexOf(deletingGroup);
    if (index > -1) {
      this.groups.splice(index, 1);
    }

    this.layers.slice().forEach(layer => {
      if (layer.parentId === deletingGroup.id) {
        currentProject.deleteLayer(layer);
      }
    });
    currentProject.groups.forEach(group => {
      if (group.parentId === deletingGroup.id) {
        this.deleteGroup(group);
      }
    });
  }

  @action
  changeZoom(value: number) {
    this.viewZoom = value;
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

  @action.bound
  setMaxLayersInBatch(count: number) {
    this._maxLayersInBatch = count;
  }

  @action
  setLayerError(layerComplexName: string, errors: string[]) {
    this.layersErrors[layerComplexName] = errors;
  }

  @action
  switchLayerId(oldId: number, newId: number) {
    this.layers.forEach(layer => {
      if (layer.id === oldId) {
        layer.id = newId;
      }
    });
  }

  @action
  switchGroupId(oldId: number, newId: number) {
    this.groups.forEach(group => {
      if (group.id === oldId) {
        group.id = newId;
      }
      if (group.parentId === oldId) {
        group.parentId = newId;
      }
    });
    this.layers.forEach(layer => {
      if (layer.parentId === oldId) {
        layer.parentId = newId;
      }
    });
  }

  private isHiddenByZoom(treeItem: TreeItem): boolean {
    if (treeItem.isGroup) {
      return false;
    }

    const { minZoom, maxZoom } = treeItem.payload as CrgLayer;

    return this.viewZoom < minZoom || (Boolean(maxZoom) && this.viewZoom > maxZoom);
  }

  private hasCollapsedParent(item: TreeItem): boolean {
    if (!item.parent) {
      return false;
    }

    const { expanded } = item.parent.payload as CrgLayersGroup;

    return expanded ? this.hasCollapsedParent(item.parent) : true;
  }

  isAncestor(item: TreeItem, ancestorItem: TreeItem): boolean {
    if (!item.parent) {
      return false;
    }

    return item.parent === ancestorItem || this.isAncestor(item.parent, ancestorItem);
  }

  getClosestCommonAncestor(a: TreeItem, b: TreeItem): TreeItem<CrgLayersGroup> | null {
    const depth = Math.min(a.depth, b.depth);

    if (a.id === b.parent?.id) {
      return a as TreeItem<CrgLayersGroup>;
    }

    if (a.parent?.id === b.id) {
      return b as TreeItem<CrgLayersGroup>;
    }

    if (!depth) {
      return null;
    }

    const genusA = this.getGenusAtDept(a, depth);
    const genusB = this.getGenusAtDept(b, depth);

    if (genusA.parent.id === genusB.parent.id) {
      return genusA.parent;
    } else {
      return this.getClosestCommonAncestor(genusA.parent, genusB.parent);
    }
  }
}

export const currentProject = CurrentProject.instance;

// инструмент для эксперимента
window['setMaxLayersInBatch'] = currentProject.setMaxLayersInBatch;
