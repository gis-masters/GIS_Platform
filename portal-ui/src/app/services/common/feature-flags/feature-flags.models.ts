export type ParsedFeatureFlagValue = string | number | boolean;

export const keys: (keyof FlagsList)[] = [
  'allowProjectionsForAllLayers',
  'openFileDownloadInSameTab',
  'featureExtractPrintAutoMap',
  'selectingFeaturesLimit',
  'showDocumentRoles'
];

export interface FlagsList {
  allowProjectionsForAllLayers: ParsedFeatureFlagValue; // boolean
  /** Открывать скачиваемый файл в текущей вкладке */
  openFileDownloadInSameTab: ParsedFeatureFlagValue; // boolean
  /** Автогенерация фрагмента карты в диалоге печати выписки об объекте */
  featureExtractPrintAutoMap: ParsedFeatureFlagValue; // boolean
  selectingFeaturesLimit: ParsedFeatureFlagValue; // number
  showDocumentRoles: ParsedFeatureFlagValue; // boolean
}
