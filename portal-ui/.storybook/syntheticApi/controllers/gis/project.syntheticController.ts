import { type InternalAxiosRequestConfig } from 'axios';

import { type CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { projects } from '../../data/projects';
import { err404 } from '../../utils';
import { type SyntheticController } from '../masterController';

class ProjectSyntheticController implements SyntheticController {
  pattern = /^.*\/projects\/(\d+)$/;

  get(config: InternalAxiosRequestConfig): CrgProject {
    const id = Number(config.url?.match(this.pattern)?.at(1));
    const project = projects.find(item => item.id === id);

    if (!project) {
      throw err404(config);
    }

    return project;
  }
}

export const projectSyntheticController = new ProjectSyntheticController();
