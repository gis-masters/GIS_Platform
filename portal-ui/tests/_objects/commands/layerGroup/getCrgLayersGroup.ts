import { CrgLayersGroup } from '../../../../src/app/services/gis/projects/projects.models';

export function getCrgLayersGroup(title: string, enabled: boolean, expanded: boolean): CrgLayersGroup {
  return {
    enabled,
    expanded,
    position: -1,
    title,
    transparency: 100
  };
}
