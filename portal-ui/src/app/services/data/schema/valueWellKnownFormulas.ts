import { getIdsFromPath } from '../../../components/DataManagement/DataManagement.utils';
import { type DocumentInfo } from '../../../components/Documents/Documents';
import { convertComplexNamesArrayToTableNamesUriFragment } from '../../gis/layers/layers.utils';
import { type FilterQuery } from '../../util/filters/filters.models';
import { type LibraryRecord } from '../library/library.models';
import { type ValueFormula } from './schema.models';

export const valueWellKnownFormulas: Record<string, ValueFormula> = {
  inherit: (obj, property, parent) => (parent as Record<string, unknown>)[property.name],

  parentDocument: (obj, property, parent: unknown) => {
    const { libraryTableName, id, title } = parent as LibraryRecord;
    const value: DocumentInfo[] = [{ id, title, libraryTableName }];

    return JSON.stringify(value);
  },

  relationLink: (obj, { valueFormulaParams = {} }) =>
    JSON.stringify({
      url:
        `/data-management/library/${String(valueFormulaParams.library)}/registry?filter=` +
        encodeURI(
          JSON.stringify({
            applicant_name: {
              $ilike: `%${String((obj as Record<string, unknown>)[valueFormulaParams.property as string])}%`
            }
          })
        ),
      text: valueFormulaParams.text
    }),

  linkToFeaturesMentioningThisDocument: (obj, { valueFormulaParams = {} }) => {
    const { id, libraryTableName, path } = obj as LibraryRecord;
    const {
      projectId,
      property,
      layers,
      text = 'Связанные объекты',
      includeParents = false
    } = valueFormulaParams as {
      projectId: number;
      property: string;
      layers: string[];
      text?: string;
      includeParents?: boolean;
    };

    const ids: number[] = [id];
    if (includeParents) {
      ids.push(...getIdsFromPath(path));
    }

    const parts = ids
      .map(
        currId =>
          `(${property}%20LIKE%20%27%25{%22id%22:${currId},%25%22libraryTableName%22:%22${libraryTableName}%22%25%27)`
      )
      .join(')%20OR%20(');

    const ps = ids.length > 1 ? '()' : [0, 0];
    const filter = `${ps[0]}${parts}${ps[1]}`;

    if (!id || !libraryTableName) {
      return [];
    }

    return JSON.stringify([
      {
        url: `/projects/${projectId}/map?queryLayers=${convertComplexNamesArrayToTableNamesUriFragment(layers)}&queryFilter=${filter}`,
        text
      }
    ]);
  },

  linkToDocumentsMentioningThisDocument: (obj, { valueFormulaParams = {} }) => {
    const { id, libraryTableName, path } = obj as LibraryRecord;
    const {
      library,
      property,
      text = 'Связанные документы',
      includeParents = false
    } = valueFormulaParams as {
      library: number;
      property: string;
      text?: string;
      includeParents?: boolean;
    };
    const pathname = `/data-management/library/${library}/registry`;
    const ids: number[] = [id];
    if (includeParents) {
      ids.push(...getIdsFromPath(path));
    }

    const parts: FilterQuery[] = ids.map(currId => ({
      [property]: {
        $ilike: `%{"id":${currId},%"libraryTableName":"${libraryTableName}"%`
      }
    }));
    const filter: string = encodeURI(JSON.stringify(parts.length === 1 ? parts[0] : { $or: parts }));

    if (!id || !libraryTableName) {
      return [];
    }

    return JSON.stringify([
      {
        url: `${pathname}?filter=${filter}`,
        text
      }
    ]);
  }
};
