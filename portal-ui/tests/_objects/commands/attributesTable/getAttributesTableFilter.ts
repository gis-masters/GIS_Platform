import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { FilterQuery } from '../../../../src/app/services/util/filters/filters.models';
import { attributesTableStore } from '../../../../src/app/stores/AttributesTable.store';

export let currentProject: CrgProject;

declare const window: {
  attributesTableStore: typeof attributesTableStore;
};

export async function getAttributesTableFilter(): Promise<FilterQuery> {
  return await browser.executeAsync(callback => {
    callback(window.attributesTableStore.filter);
  });
}
