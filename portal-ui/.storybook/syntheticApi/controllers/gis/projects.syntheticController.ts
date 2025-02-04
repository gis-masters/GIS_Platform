import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { queryObjects } from '../../../../src/app/services/util/queryObjects';
import { projects } from '../../data/projects';
import { SyntheticController } from '../masterController';
import { err404, parsePageOptions } from '../../utils';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { Role } from '../../../../src/app/services/permissions/permissions.models';
import { validateFieldValue } from '../../../../src/app/services/util/form/formValidation.utils';
import { PropertySchemaString, PropertyType } from '../../../../src/app/services/data/schema/schema.models';
import { PageableResources } from '../../../../src/server-types/common-contracts';

class ProjectsSyntheticController implements SyntheticController {
  pattern = /^.*\/projects$/;

  get(config: InternalAxiosRequestConfig): PageableResources<CrgProject> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    const result: CrgProject[] = queryObjects(projects, pageOptions);
    const totalPages =
      Math.floor(projects.length / pageOptions.pageSize) + Number(Boolean(projects.length % pageOptions.pageSize));

    return {
      content: result,
      page: {
        size: pageOptions.pageSize,
        totalElements: projects.length,
        totalPages,
        number: pageOptions.page
      }
    };
  }

  post(config: InternalAxiosRequestConfig): CrgProject {
    const data = JSON.parse(config.data) as { name: string };
    const property: PropertySchemaString = {
      title: 'title',
      propertyType: PropertyType.STRING,
      minLength: 3,
      name: 'name',
      regex: '^[a-zA-Zа-яА-Я0-9 ._-]*$',
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

    const project = {
      id: Math.max(...projects.map(({ id }) => id)) + 1,
      name: data.name,
      internalName: 'workspace_1427',
      organizationId: 1,
      createdAt: '2022-11-11T12:27:11.238515',
      role: Role.OWNER,
      default: false
    };

    projects.push(project);

    return project;
  }
}

export const projectsSyntheticController = new ProjectsSyntheticController();
