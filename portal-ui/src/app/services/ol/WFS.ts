import { WFS as OL_WFS } from 'ol/format';
import { WriteGetFeatureOptions } from 'ol/format/WFS';

import { SortOrder } from '../models';

export interface WriteGetFeatureOptionsExtended extends WriteGetFeatureOptions {
  sort?: { propertyName: string; order: SortOrder };
  featureIds?: string[];
  featureIdsNegative?: boolean;
}

export class WFS extends OL_WFS {
  writeGetFeature(extendedOptions: WriteGetFeatureOptionsExtended): Node {
    const { sort, featureIds, featureIdsNegative, ...options } = extendedOptions;
    const dom = super.writeGetFeature(options) as Element;
    const ogcNsUri = 'http://www.opengis.net/ogc';

    const xmlDoc = new DOMParser().parseFromString('<root></root>', 'text/xml');

    if (sort) {
      const elementSortBy = document.createElementNS(ogcNsUri, 'ogc:SortBy');
      const elementSortProperty = document.createElementNS(ogcNsUri, 'ogc:SortProperty');
      const elementPropertyName = document.createElementNS(ogcNsUri, 'ogc:PropertyName');
      const elementSortOrder = document.createElementNS(ogcNsUri, 'ogc:SortOrder');

      elementSortBy.append(elementSortProperty);
      elementSortProperty.append(elementPropertyName);
      elementSortProperty.append(elementSortOrder);
      elementPropertyName.append(sort.propertyName);
      elementSortOrder.append(sort.order.toLocaleUpperCase());

      dom.querySelector('Query')?.append(elementSortBy);
    }

    if (featureIds?.length) {
      const queryElem = dom.querySelector('Query');
      let filterElem = queryElem?.querySelector('Filter');
      if (!filterElem) {
        filterElem = document.createElementNS(ogcNsUri, 'Filter');
        queryElem?.append(filterElem);
      }

      const orElem = xmlDoc.createElement('Or');

      for (const fid of featureIds) {
        const fidElem = xmlDoc.createElement('FeatureId');
        fidElem.setAttribute('fid', fid);
        orElem.append(fidElem);
      }

      let fidFilter = orElem;
      if (featureIdsNegative) {
        const notElem = xmlDoc.createElement('Not');
        notElem.append(orElem);
        fidFilter = notElem;
      }

      const filterChildren = filterElem.childNodes;
      if (filterChildren.length) {
        const andElem = xmlDoc.createElement('And');
        for (const child of filterChildren) {
          andElem.append(child);
        }
        andElem.append(fidFilter);
        filterElem.append(andElem);
      } else {
        filterElem.append(fidFilter);
      }
    }

    return dom;
  }
}
