import { extractFeatureId } from '../geoserver/feature.util';

declare const browser: { options: { baseUrl: string } }; //для автотестов

export type FeaturesUrlFragment = { [dataset: string]: { [table: string]: number[] } };

export function getFeaturesUrl(
  projectId: number,
  datasetIdentifier: string,
  tableIdentifier: string,
  featureIds: string[]
): string {
  let baseUrl: string;

  if (typeof browser !== 'undefined') {
    baseUrl = browser.options.baseUrl;
  } else if (typeof window !== 'undefined') {
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
