import { type CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { type FilterQuery } from '../../../../src/app/services/util/filters/filters.models';
import { type attributesTableStore } from '../../../../src/app/stores/AttributesTable.store';

export let currentProject: CrgProject;

declare const window: {
  attributesTableStore: typeof attributesTableStore;
};

export async function getAttributesTableFilter(): Promise<FilterQuery> {
  const result = await browser.execute(function () {
    return JSON.stringify(window.attributesTableStore.filter);
  });

  return JSON.parse(result) as FilterQuery;
}
