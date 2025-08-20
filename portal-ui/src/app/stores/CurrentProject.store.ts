import { action, computed, makeObservable, observable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgRasterLayer,
  CrgVectorLayer,
  NewCrgLayer
} from '../services/gis/layers/layers.models';
import { isVectorFromFile } from '../services/gis/layers/layers.utils';
import { CrgProject, TreeItem, TreeItemPayload } from '../services/gis/projects/projects.models';
import { Role } from '../services/permissions/permissions.models';
import { getPatch } from '../services/util/patch';

interface CrgProjectData extends CrgProject {
  layers: (CrgLayer | NewCrgLayer)[];
  groups: CrgLayersGroup[];
  layersErrors: { [key: string]: string[] };
}

const emptyProject: Required<CrgProjectData> & { layers: CrgLayer[]; groups: CrgLayersGroup[] } = {
  id: 0,
  bbox: '',
  createdAt: '',
  description: '',
  default: false,
  name: '',
  order: 0,
  organizationId: 0,
  layers: [],
  layersErrors: {},
  groups: [],
  folder: false,
  path: '',
  parentId: 0,
  role: Role.VIEWER
};

class CurrentProject implements CrgProjectData {
  private static _instance: CurrentProject;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable bbox: string = emptyProject.bbox;
  @observable createdAt: string = emptyProject.createdAt;
  @observable description: string = emptyProject.description;
  @observable id: number = emptyProject.id;
  @observable name: string = emptyProject.name;
  @observable order: number = emptyProject.order;
  @observable organizationId: number = emptyProject.organizationId;
  @observable default: boolean = emptyProject.default;
  @observable layers: CrgLayer[] = emptyProject.layers;
  @observable groups: CrgLayersGroup[] = emptyProject.groups;
  @observable primalLayers: CrgLayer[] = [];
  @observable primalGroups: CrgLayersGroup[] = [];
  @observable layersErrors: Record<string, string[]> = emptyProject.layersErrors;
  @observable rawLayersFromApi: CrgLayer[] = [];
  @observable role: Role = emptyProject.role;
  @observable folder: boolean = emptyProject.folder;
  @observable filter: string = '';

  @observable viewZoom: number = 0;

  private constructor() {
    makeObservable(this);
  }

  @computed
  get tree(): TreeItem[] {
    return [
      ...this.groups.map(group => ({
        id: group.id,
        payload: group,
        isGroup: true
      })),
      ...this.vectorableLayers.map(layer => ({
        id: layer.id,
        payload: layer,
        isGroup: false,
        errors: layer.complexName ? this.layersErrors[layer.complexName] : undefined
      })),
      ...this.rasterLayers.map(layer => ({ id: layer.id, payload: layer, isGroup: false })),
      ...this.externalLayers.map(layer => ({ id: layer.id, payload: layer, isGroup: false }))
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
        item.hiddenByZoom = this.isHiddenByZoom(item);

        if (item.isGroup) {
          item.isEmptyGroup = !tree.some(someItem => !someItem.isGroup && this.isAncestor(someItem, item));
        } else {
          item.actualTransparency = this.getActualTransparency(item);
        }

        if (!item.errors && (item.payload as NewCrgLayer).complexName) {
          const itemPayload = item.payload as NewCrgLayer;

          if (itemPayload.complexName && this.layersErrors[itemPayload.complexName]) {
            item.errors = this.layersErrors[itemPayload.complexName];
          }
        }

        item.visible = !(item.errors && item.errors.length) && this.getGenusVisibility(item);

        return item;
      })
      .sort(this.sorter);
  }

  @computed
  get filteredTree(): TreeItem[] {
    const layers = currentProject.tree.filter(layer =>
      layer.payload.title.toLowerCase().includes(this.filter.toLowerCase())
    );

    const uniqueLayerParentsMap = new Map<number, TreeItem<TreeItemPayload>>();

    for (const layer of layers) {
      let currentLayer = layer.parent;

      while (currentLayer) {
        if (!uniqueLayerParentsMap.has(currentLayer.id) && !layers.some(item => item.id === currentLayer?.id)) {
          uniqueLayerParentsMap.set(currentLayer.id, currentLayer);
        }

        currentLayer = currentLayer.parent;
      }
    }

    const resultLayers = [...layers, ...uniqueLayerParentsMap.values()];
    resultLayers.sort(this.sorter);

    return resultLayers;
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
  private get visibleOnMapAndHiddenByZoomLayers(): TreeItem<CrgLayer>[] {
    return this.tree.filter(item => !item.isGroup && item.visible) as TreeItem<CrgLayer>[];
  }

  @computed
  get visibleOnMapLayers(): TreeItem<CrgLayer>[] {
    return this.visibleOnMapAndHiddenByZoomLayers.filter(item => !item.hiddenByZoom);
  }

  @computed
  get canBeEdited(): boolean {
    return this.role === Role.OWNER;
  }

  @computed
  get visibleVectorLayers(): TreeItem<CrgLayer>[] {
    return this.visibleOnMapLayers.filter(item => {
      const { type } = item.payload;

      return type === CrgLayerType.VECTOR || (type && isVectorFromFile(type));
    });
  }

  @computed
  get vectorLayers(): CrgVectorLayer[] {
    return (this.layers?.filter(l => l.type === CrgLayerType.VECTOR) || []) as CrgVectorLayer[];
  }

  @computed
  get vectorableLayers(): CrgVectorLayer[] {
    return [...this.vectorLayers, ...this.vectorFromFileLayers];
  }

  @computed
  get rasterLayers(): CrgRasterLayer[] {
    return (this.layers?.filter(l => l.type === CrgLayerType.RASTER) || []) as CrgRasterLayer[];
  }

  @computed
  get vectorFromFileLayers(): CrgVectorLayer[] {
    return (this.layers?.filter(l => l.type && isVectorFromFile(l.type)) || []) as CrgVectorLayer[];
  }

  @computed
  get externalLayers() {
    return (
      this.layers?.filter(
        l =>
          l.type === CrgLayerType.EXTERNAL ||
          l.type === CrgLayerType.EXTERNAL_GEOSERVER ||
          l.type === CrgLayerType.EXTERNAL_NSPD
      ) || []
    );
  }

  @computed
  get queriesQueueLength(): number {
    return Object.values(this.queriesQueue).flat().length;
  }

  @computed
  get queriesQueue(): {
    groupsToCreate: CrgLayersGroup[];
    groupsToPatch: [number, Partial<CrgLayersGroup>][];
    layersToCreate: CrgLayer[];
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

    const layersMeaningfulFields: (keyof NewCrgLayer)[] = [
      'enabled',
      'parentId',
      'position',
      'title',
      'transparency',
      'view',
      'styleName',
      'style',
      'minZoom',
      'maxZoom',
      'photoMode',
      'nativeCRS'
    ];

    return {
      groupsToCreate: this.tree
        .filter(({ isGroup, payload }) => isGroup && this.primalGroups.every(({ id }) => id !== payload.id))
        .map(({ payload }) => payload as CrgLayersGroup),

      groupsToPatch: this.groups
        .map(group => [group, this.primalGroups.find(primalGroup => primalGroup.id === group.id)])
        .filter(([, primalGroup]) => primalGroup)
        .map(([group, primalGroup]): [number, Partial<CrgLayersGroup>] => {
          if (!group || !primalGroup) {
            throw new Error('невероятно!');
          }

          return [group.id, getPatch(group, primalGroup, groupsMeaningfulFields)];
        })
        .filter(([, patch]) => Object.keys(patch).length),

      layersToCreate: this.tree
        .filter(({ isGroup, payload }) => !isGroup && this.primalLayers.every(({ id }) => id !== payload.id))
        .map(({ payload }) => payload as CrgLayer),

      layersToPatch: this.layers
        .map(layer => [layer, this.primalLayers.find(primalLayer => primalLayer.id === layer.id)])
        .filter(([, primalLayer]) => primalLayer)
        .map(([layer, primalLayer]): [number, Partial<CrgLayer>] => {
          if (!layer || !primalLayer) {
            throw new Error('невероятно!');
          }

          return [layer.id, getPatch(layer, primalLayer, layersMeaningfulFields)];
        })
        .filter(([, patch]) => Object.keys(patch).length),

      layersToDelete: this.primalLayers.filter(primalLayer => this.isLayerDeleted(primalLayer)).map(({ id }) => id),

      groupsToDelete: this.primalGroups
        .filter(primalGroup => this.isGroupDeleted(primalGroup))
        .sort(
          (a, b) =>
            this.tree.findIndex(({ isGroup, id }) => isGroup && id === b.id) -
            this.tree.findIndex(({ isGroup, id }) => isGroup && id === a.id)
        )
        .map(({ id }) => id)
    };
  }

  getLayerByTableNameFromVisibleVectorLayers(tableName: string): CrgLayer {
    return this.getLayerByTableNameFromLayers(
      tableName,
      this.visibleVectorLayers.map(item => item.payload)
    );
  }

  getLayerByTableNameFromVisibleAndHiddenByZoomVectorLayers(tableName: string): CrgLayer {
    return this.getLayerByTableNameFromLayers(
      tableName,
      this.visibleOnMapAndHiddenByZoomLayers.map(item => item.payload)
    );
  }

  getLayerByTableNameFromAllVectorableLayers(tableName: string): CrgLayer {
    return this.getLayerByTableNameFromLayers(tableName, this.vectorableLayers);
  }

  private getLayerByTableNameFromLayers(tableName: string, layers: CrgLayer[]): CrgLayer {
    const layer = layers.find(item => item.tableName === tableName);

    if (!layer) {
      throw new Error('Не удалось найти слой по tableName: ' + tableName);
    }

    return layer;
  }

  private isLayerDeleted(layer: CrgLayer): boolean {
    return !this.layers.some(({ id }) => id === layer.id);
  }

  private isGroupDeleted(group: CrgLayersGroup): boolean {
    return !this.groups.some(({ id }) => id === group.id);
  }

  @action
  setProject(
    project: CrgProject,
    layers: CrgLayer[],
    groups: CrgLayersGroup[],
    layersErrors: Record<string, string[]>,
    rawLayersFromApi: CrgLayer[]
  ) {
    Object.assign(this, emptyProject, {
      ...project,
      layers,
      groups,
      primalLayers: cloneDeep(layers),
      primalGroups: cloneDeep(groups),
      layersErrors,
      rawLayersFromApi
    });
  }

  @action
  patchLayer<T extends CrgLayer = CrgLayer>(layerId: number, patch: Partial<T>): T {
    return Object.assign(this.layers.find(({ id }) => id === layerId) as T, patch);
  }

  @action
  patchGroup(groupId: number, patch: Partial<CrgLayersGroup>): CrgLayersGroup {
    const group = this.groups.find(({ id }) => id === groupId);

    if (!group) {
      throw new Error('Не удалось найти группу с id ' + groupId);
    }

    return Object.assign(group, patch);
  }

  @action
  clearProject() {
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

    [...this.layers].forEach(layer => {
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
    return Boolean(item.payload.enabled && (item.parent ? this.getGenusVisibility(item.parent) : true));
  }

  @boundMethod
  private sorter(a: TreeItem, b: TreeItem): number {
    if (a.parent === b.parent) {
      return this.sortSiblings(a, b);
    }

    return this.sortCommonAncestorsChildren(a, b);
  }

  private sortSiblings(a: TreeItem, b: TreeItem): number {
    const {
      payload: { position: positionA = 0, id: idA },
      isGroup: aGroup
    } = a;
    const {
      payload: { position: positionB = 0, id: idB },
      isGroup: bGroup
    } = b;

    return positionA - positionB || idA - idB || Number(bGroup) - Number(aGroup);
  }

  private sortCommonAncestorsChildren(a: TreeItem, b: TreeItem, depth?: number): number {
    if (depth === undefined) {
      depth = Math.min(a.depth || 0, b.depth || 0);
    }

    const ax = this.getGenusAtDept(a, depth);
    const bx = this.getGenusAtDept(b, depth);

    if (ax === bx) {
      return (a.depth || 0) - (b.depth || 0);
    }

    if (ax.parent === bx.parent) {
      return this.sortSiblings(ax, bx);
    }

    return this.sortCommonAncestorsChildren(ax, bx, depth - 1);
  }

  private getGenusAtDept(item: TreeItem | undefined, depth: number): TreeItem {
    return item?.depth === depth ? item : this.getGenusAtDept(item?.parent, depth);
  }

  private getActualTransparency(item: TreeItem, value?: number): number {
    value = value || item.payload.transparency || 100;

    if (item.parent) {
      return this.getActualTransparency(
        item.parent,
        Math.round(value * ((item.parent.payload.transparency || 100) / 100))
      );
    }

    return value;
  }

  @action
  setLayerError(layerComplexName: string, errors: string[]) {
    this.layersErrors[layerComplexName] = errors;
  }

  @action
  setFilter(filter: string) {
    this.filter = filter;
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

    const { minZoom = 0, maxZoom = 40 } = treeItem.payload as CrgLayer;

    return this.viewZoom < minZoom || (Boolean(maxZoom) && this.viewZoom > maxZoom);
  }

  private hasCollapsedParent(item: TreeItem): boolean {
    if (!item.parent) {
      return false;
    }

    const { expanded } = item.parent.payload;

    return expanded ? this.hasCollapsedParent(item.parent) : true;
  }

  isAncestor(item: TreeItem, ancestorItem: TreeItem): boolean {
    if (!item.parent) {
      return false;
    }

    return item.parent === ancestorItem || this.isAncestor(item.parent, ancestorItem);
  }

  getClosestCommonAncestor(a: TreeItem, b: TreeItem): TreeItem<CrgLayersGroup> | null {
    const depth = Math.min(a.depth || 0, b.depth || 0);

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

    if (!genusA.parent || !genusB.parent) {
      return null;
    }

    return genusA.parent.id === genusB.parent.id
      ? genusA.parent
      : this.getClosestCommonAncestor(genusA.parent, genusB.parent);
  }
}

export const currentProject = CurrentProject.instance;

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { currentProject });
}
