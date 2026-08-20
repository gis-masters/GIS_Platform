import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import ImageWrapper from 'ol/Image';
import ImageState from 'ol/ImageState';

jest.mock('../../services', () => ({
  services: {
    logger: {
      error: jest.fn()
    }
  }
}));

jest.mock('../../geoserver/wms/wms.service', () => ({
  getMap: jest.fn()
}));

jest.mock('../../../stores/Map.store', () => {
  let loadingCount = 0;

  return {
    mapStore: {
      enrollLoadingStart() {
        loadingCount += 1;
      },
      enrollLoadingFinish() {
        loadingCount -= 1;
      },
      get loading() {
        return Boolean(loadingCount);
      }
    }
  };
});

jest.mock('../map.util', () => ({
  assignTileBlobUrl: jest.fn()
}));

import { mapStore } from '../../../stores/Map.store';
import { getMap } from '../../geoserver/wms/wms.service';
import { assignTileBlobUrl } from '../map.util';
import { crgLayersLoadFunction } from './crg-layers-load';

const getMapMock = jest.mocked(getMap);
const assignTileBlobUrlMock = jest.mocked(assignTileBlobUrl);

describe('crgLayersLoadFunction', () => {
  beforeEach(() => {
    getMapMock.mockReset();
    assignTileBlobUrlMock.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('enrollLoadingFinish вызывается, даже если assignTileBlobUrl бросает', async () => {
    getMapMock.mockResolvedValue(new Blob([new Uint8Array([1])]));
    assignTileBlobUrlMock.mockImplementation(() => {
      throw new Error('не удалось назначить blob');
    });

    const wrapper = new ImageWrapper([0, 0, 1, 1], 1, 1, ImageState.LOADING);
    wrapper.setImage(new Image());

    await expect(crgLayersLoadFunction(wrapper, 'https://example.com/wms')).rejects.toThrow(
      'не удалось назначить blob'
    );
    expect(mapStore.loading).toBe(false);
  });
});
