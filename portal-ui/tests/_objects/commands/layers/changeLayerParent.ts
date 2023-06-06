import { currentProject } from '../../../../src/app/stores/CurrentProject.store';

declare const window: {
  currentProject: typeof currentProject;
};

export async function changeLayerParent(layerTitle: string, groupTitle: string): Promise<void> {
  await browser.execute(
    (layerTitle: string, groupTitle: string) => {
      const layer = window.currentProject.tree.find(item => item.payload.title === layerTitle);
      const group = window.currentProject.tree.find(group => group.payload.title === groupTitle);

      if (layer && group) {
        window.currentProject.patchLayer(layer.id, { parentId: group.id });
      }
    },
    layerTitle,
    groupTitle
  );
}
