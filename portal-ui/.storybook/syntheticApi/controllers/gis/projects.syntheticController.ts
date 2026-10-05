import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { type PropertySchemaString, PropertyType } from '../../../../src/app/services/data/schema/schema.models';
import { type CrgProject, type NewCrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { Role } from '../../../../src/app/services/permissions/permissions.models';
import { validateFieldValue } from '../../../../src/app/services/util/form/formValidation.utils';
import { type PageableResources } from '../../../../src/server-types/common-contracts';
import { projects } from '../../data/projects';
import { err404, getQueryParams, parseBody, parsePageOptions, toPageable } from '../../utils';
import { type SyntheticController } from '../masterController';

class ProjectsSyntheticController implements SyntheticController {
  pattern = /^.*\/projects$/;

  get(config: InternalAxiosRequestConfig): PageableResources<CrgProject> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    const params = getQueryParams(config);
    const parent = typeof params.parent === 'string' || typeof params.parent === 'number' ? params.parent : undefined;
    const source =
      parent === undefined || parent === ''
        ? projects.filter(project => project.parentId == null)
        : projects.filter(project => String(project.parentId) === String(parent));

    if (typeof params.name === 'string' && params.name) {
      pageOptions.filter = {
        ...pageOptions.filter,
        name: { $ilike: `%${params.name}%` }
      };
    }

    return toPageable(source, pageOptions);
  }

  post(config: InternalAxiosRequestConfig): CrgProject {
    const data = parseBody<NewCrgProject>(config.data);
    const property: PropertySchemaString = {
      title: 'title',
      propertyType: PropertyType.STRING,
      minLength: 3,
      name: 'name',
      regex: '^[a-zA-Zа-яА-ЯёЁ0-9 ._-]*$',
      regexErrorMessage: 'Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_'
    };
    const errors = validateFieldValue(data.name, property, data);

    if (errors?.messages?.length) {
      throw new AxiosError('bad request', 'bad request', config, null, {
        config,
        status: 400,
        statusText: 'bad request',
        data: {
          status: 'BAD_REQUEST',
          message: 'Argument validation exception',
          errors: errors.messages.map(message => ({ field: 'projectName', message }))
        },

        headers: {}
      });
    }

    const project: CrgProject = {
      id: Math.max(...projects.map(({ id }) => id)) + 1,
      name: data.name,
      description: data.description,
      bbox: data.bbox,
      organizationId: 1,
      createdAt: new Date().toISOString(),
      role: Role.OWNER,
      folder: Boolean(data.folder),
      default: false,
      parentId: data.parentId
    };

    projects.push(project);

    return project;
  }
}

export const projectsSyntheticController = new ProjectsSyntheticController();
