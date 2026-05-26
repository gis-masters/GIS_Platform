import { beforeEach, describe, expect, test } from '@jest/globals';

import { CrgLayerType, type CrgVectorLayer } from '../services/gis/layers/layers.models';
import { type CrgProject } from '../services/gis/projects/projects.models';
import { Role } from '../services/permissions/permissions.models';
import { currentProject } from './CurrentProject.store';

function createTestLayer(overrides: Partial<CrgVectorLayer> = {}): CrgVectorLayer {
  return {
    id: 1,
    title: 'Layer',
    type: CrgLayerType.VECTOR,
    enabled: true,
    nativeCRS: 'EPSG:3857',
    resourceId: 'resource-1',
    dataset: 'dataset-1',
    position: 0,
    ...overrides
  };
}

const testProject: CrgProject = {
  id: 1,
  name: 'Test project',
  role: Role.VIEWER,
  folder: false
};

function setupProject(layer: CrgVectorLayer, layersErrors: Record<string, string[]> = {}) {
  currentProject.setProject(testProject, [layer], [], layersErrors, [layer]);
}

describe('CurrentProject.store', () => {
  describe('temporaryVisibleLayers', () => {
    beforeEach(() => {
      currentProject.clearProject();
    });

    describe('add / remove', () => {
      test('add добавляет id в массив', () => {
        currentProject.addTemporaryVisibleLayers([1, 2]);

        expect(currentProject.temporaryVisibleLayers).toEqual([1, 2]);
      });

      test('remove снимает одно вхождение id', () => {
        currentProject.addTemporaryVisibleLayers([1, 1]);
        currentProject.removeTemporaryVisibleLayers([1]);

        expect(currentProject.temporaryVisibleLayers).toEqual([1]);
      });

      test('повторный add накапливает ref-count для пересекающихся id', () => {
        currentProject.addTemporaryVisibleLayers([10, 11]);
        currentProject.addTemporaryVisibleLayers([10, 12]);

        expect(currentProject.temporaryVisibleLayers).toEqual([10, 11, 10, 12]);
      });

      test('remove одного сеанса оставляет id второго сеанса', () => {
        currentProject.addTemporaryVisibleLayers([10, 11]);
        currentProject.addTemporaryVisibleLayers([10, 12]);
        currentProject.removeTemporaryVisibleLayers([10, 11]);

        expect(currentProject.temporaryVisibleLayers).toEqual([10, 12]);
      });

      test('remove всех сеансов очищает temporaryVisibleLayers', () => {
        currentProject.addTemporaryVisibleLayers([10, 11]);
        currentProject.addTemporaryVisibleLayers([10, 12]);
        currentProject.removeTemporaryVisibleLayers([10, 11]);
        currentProject.removeTemporaryVisibleLayers([10, 12]);

        expect(currentProject.temporaryVisibleLayers).toEqual([]);
      });

      test('clearTemporaryVisibleLayers очищает массив', () => {
        currentProject.addTemporaryVisibleLayers([1, 2]);
        currentProject.clearTemporaryVisibleLayers();

        expect(currentProject.temporaryVisibleLayers).toEqual([]);
      });

      test('setProject сбрасывает temporaryVisibleLayers', () => {
        currentProject.addTemporaryVisibleLayers([1, 2]);
        setupProject(createTestLayer());

        expect(currentProject.temporaryVisibleLayers).toEqual([]);
      });
    });

    describe('visibleOnMapLayers', () => {
      test('временно видимый слой попадает в visibleOnMapLayers', () => {
        setupProject(createTestLayer({ id: 42, enabled: false }));
        currentProject.addTemporaryVisibleLayers([42]);

        expect(currentProject.visibleOnMapLayers.map(item => item.id)).toContain(42);
      });

      test('temporaryVisibleLayers не меняет item.visible в tree', () => {
        setupProject(createTestLayer({ id: 42, enabled: false }));
        currentProject.addTemporaryVisibleLayers([42]);

        expect(currentProject.tree.find(item => item.id === 42)?.visible).toBe(false);
      });

      test('слой вне масштаба не попадает в visibleOnMapLayers без temporaryVisibleLayers', () => {
        setupProject(createTestLayer({ id: 42, enabled: false, minZoom: 10 }));
        currentProject.changeZoom(5);

        expect(currentProject.visibleOnMapLayers.map(item => item.id)).not.toContain(42);
      });

      test('временно видимый слой вне масштаба попадает в visibleOnMapLayers', () => {
        setupProject(createTestLayer({ id: 42, enabled: false, minZoom: 10 }));
        currentProject.changeZoom(5);
        currentProject.addTemporaryVisibleLayers([42]);

        expect(currentProject.visibleOnMapLayers.map(item => item.id)).toContain(42);
      });

      test('слой с ошибками не попадает на карту даже при temporaryVisibleLayers', () => {
        setupProject(createTestLayer({ id: 42, enabled: false, complexName: 'broken_layer' }), {
          broken_layer: ['layer error']
        });
        currentProject.addTemporaryVisibleLayers([42]);

        expect(currentProject.visibleOnMapLayers.map(item => item.id)).not.toContain(42);
      });
    });
  });
});
