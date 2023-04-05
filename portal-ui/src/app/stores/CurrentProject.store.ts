import { action, computed, observable, makeObservable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { attributesTableStore } from './AttributesTable.store';
import { Role } from '../services/data/permissions/permissions.models';
import { getPatch } from '../services/util/patch';
import { CrgProject, TreeItem } from '../services/gis/projects/projects.models';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgRasterLayer,
  CrgVectorLayer,
  NewCrgLayer
} from '../services/gis/layers/layers.models';

const MAX_LAYERS_IN_BATCH = 5;

interface CrgProjectData extends CrgProject {
  layers: (CrgLayer | NewCrgLayer)[];
  groups: CrgLayersGroup[];
  layersErrors: { [key: string]: string[] };
}

const emptyProject: CrgProjectData = {
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
  role: undefined
};

class CurrentProject implements CrgProjectData {
  private static _instance: CurrentProject;

  @observable bbox: string;
  @observable createdAt: string;
  @observable description: string;
  @observable id: number;
  @observable name: string;
  @observable order: number;
  @observable organizationId: number;
  @observable default: boolean;
  @observable layers: CrgLayer[];
  @observable groups: CrgLayersGroup[];
  @observable primalLayers: CrgLayer[];
  @observable primalGroups: CrgLayersGroup[];
  @observable layersErrors: Record<string, string[]>;
  @observable rawLayersFromApi: CrgLayer[];
  @observable role: Role;

  @observable viewZoom: number;

  private constructor() {
    makeObservable(this);
  }

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
      ...this.vectorableLayers.map(layer => ({
        id: layer.id,
        payload: layer,
        isGroup: false,
        errors: this.layersErrors[layer.complexName]
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

        if (!item.isGroup) {
          item.actualTransparency = this.getActualTransparency(item);
        } else {
          item.isEmptyGroup = !tree.some(someItem => !someItem.isGroup && this.isAncestor(someItem, item));
        }

        if (!item.errors && (item.payload as NewCrgLayer).complexName) {
          const itemPayload = item.payload as NewCrgLayer;

          if (this.layersErrors[itemPayload.complexName]) {
            item.errors = this.layersErrors[itemPayload.complexName];
          }
        }

        item.visible = !(item.errors && item.errors.length) && this.getGenusVisibility(item);

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
    return cloneDeep(this.visibleOnMapLayers).reduce((acc: TreeItem<CrgLayer>[][], currentItem: TreeItem<CrgLayer>) => {
      if (!acc.length) {
        return [[currentItem]];
      }

      const lastBatch = acc[acc.length - 1];
      const previousItem = lastBatch[lastBatch.length - 1];

      if (this.canBeBatched(lastBatch, previousItem, currentItem)) {
        lastBatch.push(currentItem);
      } else {
        acc.push([currentItem]);
      }

      return acc;
    }, []);
  }

  private canBeBatched(
    lastBatch: TreeItem<CrgLayer>[],
    previousItem: TreeItem<CrgLayer>,
    currentItem: TreeItem<CrgLayer>
  ) {
    const previousTransparency = previousItem.actualTransparency;
    const previousType = previousItem.payload.type;
    const currentTransparency = currentItem.actualTransparency;
    const currentType = currentItem.payload.type;

    return (
      currentTransparency === previousTransparency &&
      currentType === previousType &&
      currentType !== CrgLayerType.RASTER &&
      lastBatch.length < MAX_LAYERS_IN_BATCH &&
      !attributesTableStore.isLayerFiltered(currentItem.payload) &&
      !attributesTableStore.isLayerFiltered(previousItem.payload) &&
      !previousItem.payload.styleName &&
      !currentItem.payload.styleName
    );
  }

  @computed
  get canBeEdited(): boolean {
    return this.role === Role.OWNER;
  }

  @computed
  get visibleLayersWithoutRasters(): TreeItem<CrgLayer>[] {
    return this.visibleOnMapLayers.filter(item => item.payload.type !== CrgLayerType.RASTER);
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
    return (this.layers?.filter(l => l.type === CrgLayerType.VECTOR_FROM_FILE) || []) as CrgVectorLayer[];
  }

  @computed
  get externalLayers() {
    return (
      this.layers?.filter(l => l.type === CrgLayerType.EXTERNAL || l.type === CrgLayerType.EXTERNAL_GEOSERVER) || []
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

    const layersMeaningfulFields: (keyof NewCrgLayer)[] = [
      'enabled',
      'parentId',
      'position',
      'title',
      'transparency',
      'view',
      'styleName',
      'minZoom',
      'maxZoom'
    ];

    return {
      groupsToCreate: this.tree
        .filter(({ isGroup, payload }) => isGroup && this.primalGroups.every(({ id }) => id !== payload.id))
        .map(({ payload }) => payload as CrgLayersGroup),

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
        .filter(primalLayer => this.isLayerDeleted(primalLayer) || this.hasDeletedAncestor(primalLayer))
        .map(({ id }) => id),

      groupsToDelete: this.primalGroups
        .filter(primalGroup => this.isGroupDeleted(primalGroup) || this.hasDeletedAncestor(primalGroup))
        .sort(
          (a, b) =>
            this.tree.findIndex(({ isGroup, id }) => isGroup && id === b.id) -
            this.tree.findIndex(({ isGroup, id }) => isGroup && id === a.id)
        )
        .map(({ id }) => id)
    };
  }

  public getLayerByTableName(tableName: string): CrgLayer {
    return currentProject.visibleLayersWithoutRasters
      .filter(item => {
        return item.payload.tableName === tableName;
      })
      .map(item => item.payload)[0];
  }

  private hasDeletedAncestor(entity: CrgLayer | CrgLayersGroup): boolean {
    if (!entity.parentId) {
      return false;
    }

    const parentGroup = this.groups.find(({ id }) => entity.parentId === id);

    return !parentGroup || this.hasDeletedAncestor(parentGroup);
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
    return Object.assign(
      this.groups.find(({ id }) => id === groupId),
      patch
    );
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
    return item.depth === depth ? item : this.getGenusAtDept(item.parent, depth);
  }

  private getActualTransparency(item: TreeItem, value?: number): number {
    value = value || item.payload.transparency;

    if (item.parent) {
      return this.getActualTransparency(item.parent, Math.round(value * (item.parent.payload.transparency / 100)));
    }

    return value;
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
