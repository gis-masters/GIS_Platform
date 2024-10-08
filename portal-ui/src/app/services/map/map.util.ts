import { extractFeatureId } from '../geoserver/featureType/featureType.util';
import { MapPosition } from './map.models';

declare const browser: { options: { baseUrl: string } }; //для автотестов

export type FeaturesUrlFragment = { [dataset: string]: { [table: string]: number[] } };

export function getFeaturesUrl(
  projectId: number,
  datasetIdentifier: string,
  tableIdentifier: string,
  featureIds: string[],
  position?: MapPosition
): string {
  let baseUrl: string;

  if (typeof browser === 'object' && browser && browser.options) {
    baseUrl = browser.options.baseUrl;
  } else if (typeof window === 'object') {
    baseUrl = window.location.origin;
  } else {
    baseUrl = 'http://localhost';
  }

  const featuresUrlFragment: FeaturesUrlFragment = {};

  buildFeaturesUrlFragment(
    featuresUrlFragment,
    datasetIdentifier,
    tableIdentifier,
    featureIds.map(featureId => extractFeatureId(featureId))
  );

  if (position) {
    return `${baseUrl}/projects/${projectId}/map/?zoom=${position.zoom}&center=${position.center.join(',')}&features=${JSON.stringify(featuresUrlFragment)}`;
  }

  return `${baseUrl}/projects/${projectId}/map/?features=${JSON.stringify(featuresUrlFragment)}`;
}

export function buildFeaturesUrlFragment(
  featuresUrlFragment: FeaturesUrlFragment,
  datasetIdentifier: string,
  tableIdentifier: string,
  featureIds: number[]
): void {
  if (!featuresUrlFragment[datasetIdentifier]) {
    featuresUrlFragment[datasetIdentifier] = {};
  }
  if (!featuresUrlFragment[datasetIdentifier][tableIdentifier]) {
    featuresUrlFragment[datasetIdentifier][tableIdentifier] = [];
  }

  featuresUrlFragment[datasetIdentifier][tableIdentifier].push(...featureIds);
}
