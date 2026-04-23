export type ParsedFeatureFlagValue = string | number | boolean;

export const keys: (keyof FlagsList)[] = [
  'allowProjectionsForAllLayers',
  'oldPrintMechanism',
  'openFileDownloadInSameTab',
  'featureExtractPrintAutoMap',
  'selectingFeaturesLimit',
  'showDocumentRoles',
  'reportTemplatesInDataManagement'
];

export interface FlagsList {
  allowProjectionsForAllLayers: ParsedFeatureFlagValue; // boolean
  oldPrintMechanism: ParsedFeatureFlagValue; // boolean
  /** Открывать скачиваемый файл в текущей вкладке (boolean). */
  openFileDownloadInSameTab: ParsedFeatureFlagValue;
  /** Автогенерация фрагмента карты в печати выписки (boolean). */
  featureExtractPrintAutoMap: ParsedFeatureFlagValue;
  selectingFeaturesLimit: ParsedFeatureFlagValue; // number
  showDocumentRoles: ParsedFeatureFlagValue; // boolean
  /** Раздел "Шаблоны отчётов" в управлении данными (только вместе с правами админа организации) */
  reportTemplatesInDataManagement: ParsedFeatureFlagValue; // boolean
}
