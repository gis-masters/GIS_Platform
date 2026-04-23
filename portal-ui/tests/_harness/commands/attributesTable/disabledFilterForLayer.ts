import { type CrgVectorLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { type CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { type attributesTableStore } from '../../../../src/app/stores/AttributesTable.store';

export let currentProject: CrgProject;

declare const window: {
  attributesTableStore: typeof attributesTableStore;
};

export async function disabledFilterForLayer(layer: CrgVectorLayer): Promise<void> {
  await browser.executeAsync((layer: CrgVectorLayer, callback) => {
    window.attributesTableStore.disableFilterForLayer(layer);

    callback();
  }, layer);
}
