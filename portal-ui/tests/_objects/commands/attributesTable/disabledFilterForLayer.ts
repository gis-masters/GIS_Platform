import { CrgVectorLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { attributesTableStore } from '../../../../src/app/stores/AttributesTable.store';

export let currentProject: CrgProject;

declare const window: {
  attributesTableStore: typeof attributesTableStore;
};

export async function disabledFilterForLayer(layer: CrgVectorLayer): Promise<void> {
  await browser.executeAsync((layer: CrgVectorLayer, callback) => {
    window.attributesTableStore.setFilterEnablednessForLayer(layer, false);

    callback();
  }, layer);
}
